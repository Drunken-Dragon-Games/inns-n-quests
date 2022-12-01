import fs from "fs/promises"
import { Server } from "http"
import { AddressInfo } from "net"
import child_process from "child_process"

import { config } from "./config"
import { WithDatabase } from "./utypes"
import { retryBoolSync } from "./concurrency"
import path from "path"

type RunningApp<A> = { 
    server: Server, 
    app: A
}

interface DbConfigLike {
    host: string
    port: number
    username: string
    password: string 
    database: string
}

export class ApplicationTestContext<D, A extends WithDatabase<D>> {

    private server?: RunningApp<A>
    
    constructor (private options: {
        killPgDocker: boolean,
        appConstructor: (dbConfig: DbConfigLike) => A
    }) {}

    private dockerPidPath = 
        path.join(__dirname, "..", ".docker.pid")

    private dbConfig =
        { host: "localhost"
        , port: 5432
        , username: "postgres"
        , password: "admin"
        , database: "service_db"
        }

    private pgCmd = 
        [ "docker run -d"
        , `-e POSTGRES_DB=${this.dbConfig.database}`
        , `-e POSTGRES_USER=${this.dbConfig.username}`
        , `-e POSTGRES_PASSWORD=${this.dbConfig.password}`
        , `-p 5432:5432`
        , "--health-cmd pg_isready"
        , "--health-interval 1s"
        , "--health-timeout 5s"
        , "--health-retries 30"
        , "postgres:14.5"
        ].join(" ")

    /**
     * Setups a postgres db using your local docker and starts your provided service.
     *  
     * @returns the address of the service in localhost and assigned free port
     */
    public async run(): Promise<{ address: string, app: A }> {
        this.checkDockerIsRunning()
        await this.setupTemporalDB()
        const app = this.options.appConstructor(this.dbConfig)
        this.server = await this.startServer(app)
        const address = this.parseServerAddress(this.server)
        return { address, app }
    }

    /**
     * Cleans up the resources, including the service and the postgres db
     */
    public async teardown(): Promise<void> {
        await this.closeServer(this.server!) 
        await this.teardownTemporalDB()
    }

    private checkDockerIsRunning(): void {
        try { child_process.execSync("docker --version") } 
        catch (_) {
            const error = new Error("Docker not running, these tests needs a running version of Docker.")
            console.error(error)
            throw error
        }
    }

    private async setupTemporalDB(): Promise<void> {
        const inGitHubCI = config.booleanOrElse("GITHUB_CI", false)
        if (inGitHubCI) return
        else {
            const oldDockerId = await this.readDockerPidFile() 
            if (oldDockerId == null)
                await this.startPostgresDocker()
            else {
                if (this.checkPostgresIsRunning(oldDockerId)) {
                    if (this.options.killPgDocker) {
                        await this.teardownTemporalDB()
                        await this.startPostgresDocker()
                    } else return 
                } else {
                    await this.rmDockerPidFile()
                    await this.startPostgresDocker()
                }
            }
        }
    }

    private async startPostgresDocker(): Promise<void> {
        const dockerId = child_process.execSync(this.pgCmd).toString().replace("\n", "")
        const workingDB = await retryBoolSync(() => this.checkPostgresIsRunning(dockerId))
        if (!workingDB) throw new Error("Attempted to setup docker database but ultimately failed")
        await this.createDockerPidFile(dockerId)
    }

    private async teardownTemporalDB(): Promise<void> {
        const dockerId = await this.readDockerPidFile()
        if (dockerId === null || !this.options.killPgDocker) return
        child_process.execSync(`docker rm -f ${dockerId}`)
        await this.rmDockerPidFile()
    }

    private async createDockerPidFile(dockerId: string): Promise<void> {
        await fs.writeFile(this.dockerPidPath, dockerId, "utf-8")
    }

    private async rmDockerPidFile(): Promise<void> {
        try { await fs.rm(this.dockerPidPath) } catch (_) {}
    }

    private async readDockerPidFile(): Promise<string | null> {
        try { return await fs.readFile(this.dockerPidPath, "utf-8") } 
        catch (_) { return null }
    }

    private checkPostgresIsRunning(dockerId: string): boolean {
        try { return child_process.execSync(`docker exec -i ${dockerId} pg_isready`)
            .toString()
            .includes("accepting connections") }
        catch (_) { return false }
    }

    private async startServer(app: A): Promise<RunningApp<A>> {
        const server = await app.runListen()
        await app.runMigrations()
        return { server, app }
    }

    private async closeServer(runningApp: RunningApp<A>): Promise<void> {
        await new Promise<void>((resolve) => {
            runningApp.server.close(() => resolve())
        })
        await runningApp.app.closeDatabase()
    }

    private parseServerAddress = (runningApp: RunningApp<A>): string => {
        const serverAddress = runningApp.server.address()
        if (typeof serverAddress === "string")
            return serverAddress
        else {
            const info = serverAddress as AddressInfo
            return "http://localhost:"+info.port
        }
    }
}
