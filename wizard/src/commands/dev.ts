import { CliUx, Command, Flags } from '@oclif/core'
import { access, cp, readFile } from 'fs/promises'
import * as steps from "../steps.js"
import { ChildProcess, spawn } from 'child_process'
import inquirer from 'inquirer'

export default class Dev extends Command {
    static description = 'describe the command here'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static flags = {}

    static args = []

    async ensureEnvFileExists(): Promise<void> {
        try {
            await access('.wiz/backend/.env')
            await cp('.wiz/backend/.env', 'backend/.env')
        } catch (e) {
            this.log("No .wiz/backend/.env file found. You can create one by running 'wiz genenv'")
        }
    }

    async readEnvFile(): Promise<NodeJS.ProcessEnv> {
        const envFile = await readFile('.wiz/backend/.env')
        const envFileLines = envFile.toString().split('\n')
        const env: NodeJS.ProcessEnv = {}
        envFileLines.forEach(line => {
            const [key, value] = line.split('=')
            env[key] = value
        })
        return env
    }

    // Use inquirer lib to ask for user options
    async loop(/*backend: ChildProcess*/): Promise<void> {
        const answers = await inquirer.prompt([{ 
            name: 'next-action', 
            message: 'What do you want to do now?',
            type: 'list', 
            choices: [
                { name: 'Stop backend', value: 'stop-backend' }, 
                { name: 'Stop backend and Docker Postgres container', value: 'stop-backend-and-docker-postgres-container' }, 
                { name: 'Stop backend, Docker Postgres container and exit', value: 'stop-backend-and-docker-postgres-container-and-exit' }
            ]
        }])
        if (answers['next-action'] === 'stop-backend-and-docker-postgres-container-and-exit') 
            this.exit()
        else 
            await this.loop()
    }

    public async run(): Promise<void> {
        await this.ensureEnvFileExists()
        CliUx.ux.action.start(`Starting Docker Postgres container`)
        const freshDB = await steps.startDockerPostgresContainer()
        CliUx.ux.action.stop(freshDB ? 'Created fresh database' : 'Reused existing database')
        const backend = spawn("cd backend && npm run dev")//, { env: await this.readEnvFile() })
        backend.stdout.on("data", this.log)
        backend.stderr.on("data", this.error)
        //await this.loop()
    }
}
