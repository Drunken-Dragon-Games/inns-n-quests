import util from 'util'
import { access, mkdir, rm } from 'fs/promises'
import { exec } from 'child_process'
import { PlatformTypes } from '@oclif/core/lib/interfaces'

const execp = util.promisify(exec)

// Verify current directory is the ddu project
export async function verifyCurrentDirectoryIsDDUProject(platform: PlatformTypes): Promise<boolean> {
    try {
        await access('./backend')
        await access('./frontend')
        const stringToFind = "# The Drunken Dragon Universe App"
        if (platform === "win32") {
            const { stdout, stderr } = await execp(`type README.md | findstr "${stringToFind}"`)            
            return stdout.includes(stringToFind) && !stderr.includes('The system cannot find the file specified')
        } else {
            const { stdout, stderr } = await execp(`cat README.md | grep "${stringToFind}"`)
            return stdout.includes(stringToFind) && !stderr.includes('No such file or directory')
        }
    } catch (e) {
        return false
    }
}

// Verifies that the Docker daemon is running and accessible
export async function verifyDockerDaemonIsRunning(): Promise<boolean> {
    try { 
        await execp('docker ps') 
        return true
    } catch (e) {
        return false
    }
}

// Verifies that docker-compose is installed and accessible 
export async function verifyDockerComposeIsInstalled(): Promise<boolean> {
    try {
        await execp('docker-compose version')
        return true
    } catch (e) {
        return false
    }
}

// Create .wiz directory if doesn't exist
async function createWizDirectory(): Promise<void> {
    try { await mkdir('.wiz') } catch (e) { return }
}

// Create .wiz/backend directory if doesn't exist
async function createWizBackendDirectory(): Promise<void> {
    try { await mkdir('.wiz/backend') } catch (e) { return }
}

// Create .wiz/frontend directory if doesn't exist
async function createWizFrontendDirectory(): Promise<void> {
    try { await mkdir('.wiz/frontend') } catch (e) { return }
}

// Create .wiz/backend/.env file if doesn't exist
export async function createWizBackendEnvFile(platform: PlatformTypes): Promise<void> {
    await rm('.wiz/backend/.env', { force: true })
    if (platform === "win32") {
        try { await execp('type nul > .wiz/backend/.env') } catch (e) { return }
    } else {
        try { await execp('touch .wiz/backend/.env') } catch (e) { return }
    }
}

// Setup .wiz structure
export async function setupWizStructure(): Promise<void> {
    await createWizDirectory()
    await createWizBackendDirectory()
    await createWizFrontendDirectory()
}

// Build docker images
export async function buildDockerImage(project: "backend" | "frontend"): Promise<void> {
    await execp((project == "backend" ? 'cd backend && npm run build && cd .. && ' : '') + `docker build -t ddu-${project}:local ./${project}`)
}

// Start docker postgres container
export async function startDockerPostgresContainer(): Promise<void> {
    const { stdout, stderr } = await execp('docker run -d -e POSTGRES_DB=service_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -p 5432:5432 --health-cmd pg_isready --health-interval 1s --health-timeout 5s --health-retries 30 postgres:14.5')
    console.log(stdout)
    await execp(`docker kill ${stdout}`)
}