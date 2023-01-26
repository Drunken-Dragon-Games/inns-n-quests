import util from 'util'
import { exec } from 'child_process'
import { Command, Flags, CliUx } from '@oclif/core'
import { rm, writeFile } from 'fs/promises'
import { access } from 'fs/promises'
import inquirer from 'inquirer'
import * as steps from '../steps.js'

const execp = util.promisify(exec)

type EnvFile = {
    DB_HOST: string,
    DB_PORT: string,
    DB_USERNAME: string,
    DB_PASSWORD: string,
    DB_DATABASE: string,
    SECRET_KEY: string,
    BLOCKFROST_API_KEY: string,
    DISCORD_CLIENT_ID: string,
    DISCORD_CLIENT_SECRET: string,
    DISCORD_REDIRECT_URI_VALIDATE: string,
    DISCORD_REDIRECT_URI_ADD: string,
    CORS_ORIGIN: string,
    POLICY_DRAGON_SILVER: string,
    POLICY_PIXEL_TILES: string,
    POLICY_GMAS: string,
    POLICY_THIOLDEN: string,
    POLICY_EMOJIS: string,
    POLICY_SLIMES: string,
    POLICY_FURNITURE: string,
    ENCRYPTION_PASSWORD: string,
    ENCRYPTED_REGISTRY: string,
}

type GeneratedRegistryData = {
    network: string,
    password: string,
    salt: string,
    policies: {
        pixelTiles: string,
        gmas: string,
        thiolden: string,
        dragonSilver: string,
        emojis: string,
        slimes: string,
        furniture: string,
    },
    registry: string
}

export default class Genenv extends Command {
    static description = 'Wizard to configure and generate a local development environment for the Drunken Dragon Universe App'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static flags = {
    }

    static args = [{ name: 'file' }]

    private async verifyValidWorkingEnvironment(): Promise<void> {
        if (!await steps.verifyCurrentDirectoryIsDDUProject(this.config.platform)) {
            this.log("Wizard can only do its magic when on the root of the 'ddu' project, please cd into it.")
            this.exit(1)
        } else if (!await steps.verifyDockerDaemonIsRunning()) {
            this.log("Docker daemon is not running, please install and start Docker. We recommend Docker for Desktop!")
            this.exit(1)
        } else if (!await steps.verifyDockerComposeIsInstalled()) {
            this.log("Docker compose is not installed, please install docker-compose. We recommend Docker for Desktop!")
            this.exit(1)
        } 
    }

    private async verifyBackendEnvFile(): Promise<void> {
        try {
            await access('.wiz/backend/.env')
            const answers = await inquirer.prompt([{
                name: 'replace-env-file',
                message: 'The backend .wiz/backend/.env file already exists, would you like to replace it?',
                type: 'confirm',
            }])
            if (answers['replace-env-file']) {
                await rm(".wiz/backend/.env")
                await steps.createWizBackendEnvFile(this.config.platform)
            } else {
                this.log("The backend .wiz/backend/.env file already exists, skipping creation.")
                this.exit(0)
            }
        } catch(e) {
            await steps.createWizBackendEnvFile(this.config.platform)
        }
    }

    async installNpmDependencies(subdirectory: "backend" | "frontend"): Promise<void> {
        CliUx.ux.action.start(`Installing ${subdirectory} npm dependencies`)
        await execp(`cd ${subdirectory} && npm install && cd ..`)
        CliUx.ux.action.stop()
    }

    async promptBlockFrostRequirement(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'blockfrost-requirement',
            message: 'INFO: The Drunken Dragon Universe App requires a BlockFrost API key to access the Cardano blockchain information and submit transactions. Press enter to continue...',
            type: 'confirm',
        }])
        if (!answers['blockfrost-requirement']) {
            this.log("The Drunken Dragon Universe App requires a BlockFrost API key to function. Please create one and run the wizard again.")
            this.exit(1)
        }
    }

    async promptBlockFrostAccountCreation(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'create-blockfrost-account',
            message: 'Head to https://blockfrost.io/ and create a free account. Press enter to continue...',
            type: 'confirm',
        }])
        if (!answers['create-blockfrost-account']) {
            this.log("The Drunken Dragon Universe App requires a BlockFrost API key to function. Please create one and run the wizard again.")
            this.exit(1)
        }
    }

    async requestBlockFrostApiKey(): Promise<string> {
        const answers = await inquirer.prompt([{
            name: 'blockfrost-api-key',
            message: 'Input your "preprod" BlockFrost API key, you can get one at https://blockfrost.io/dashboard after creating a preprod project.',
            type: 'input',
        }])
        return answers['blockfrost-api-key']
    }

    async promptDiscordRequirement(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'discord-requirement',
            message: 'INFO: The Drunken Dragon Universe App requires a Discord developer application. Press enter to continue...',
            type: 'confirm',
        }])
        if (!answers['discord-requirement']) {
            this.log("The Drunken Dragon Universe App requires a Discord OAuth client ID and secret to function. Please create one and run the wizard again.")
            this.exit(1)
        }
    }

    async promptDiscordAppCreation(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'create-discord-app',
            message: 'Now head to https://discord.com/developers/applications, log in with your Discord account and create a new application. Press enter to continue...',
            type: 'confirm',
        }])
        if (!answers['create-discord-app']) {
            this.log("The Drunken Dragon Universe App requires a Discord OAuth client ID and secret to function. Please create one and run the wizard again.")
            this.exit(1)
        }
    }

    async requestDiscordClientID(): Promise<string> {
        const answers = await inquirer.prompt([{
            name: 'discord-client-id',
            message: 'Input your Discord OAuth client ID, you can find it at the OAuth2 tab of your Discord application',
            type: 'input',
        }])
        return answers['discord-client-id']
    }

    async requestDiscordSecret(): Promise<string> {
        const answers = await inquirer.prompt([{
            name: 'discord-secret',
            message: 'Input your Discord OAuth secret, you can find it at the OAuth2 tab of your Discord application',
            type: 'input',
        }])
        return answers['discord-secret']
    }

    async promptNGrokRequirement(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'ngrok-requirement',
            message: 'INFO: (Optional) The Drunken Dragon Universe App dev environment requires ngrok to redirect the Discord OAuth2 callbacks to your local machine (you don\'t need to install it if you dont want to test the Discord authentication features or are not using the local dev environment). Press enter to continue...',
            type: 'confirm',
        }])
        if (!answers['ngrok-requirement']) {
            this.log("The Drunken Dragon Universe App requires ngrok to be installed. Please install it and run the wizard again.")
            this.exit(1)
        }
    }

    async promptNGrokAppCreation(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'create-ngrok-app',
            message: '(Optional) Now head to https://dashboard.ngrok.com/get-started/setup and 1) create a new account, 2) install the ngrok binary locally, 3) connect your account (instructions at the provided webpage). Press enter to continue...',
            type: 'confirm',
        }])
        if (!answers['create-ngrok-app']) {
            this.log("The Drunken Dragon Universe App requires ngrok to be installed. Please install it and run the wizard again.")
            this.exit(1)
        }
    }

    /*
    async promptForDiscordConfiguration(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'configure-discord',
            message: '(Optional) Go back to the Discord OAuth2 tab and add the following redirect URIs at the "Redirects" section: http://localhost:3000/discordValidate and http://localhost:3000/discordAdd. Press enter to continue.',
            type: 'confirm',
        }])
        if (!answers['configure-discord']) {
            this.log("The Drunken Dragon Universe App requires the Discord OAuth2 redirect URIs to be configured. Please configure them and run the wizard again.")
            this.exit(1)
        }
    }
    */

    async generateAssetRegistry(): Promise<GeneratedRegistryData> {
        CliUx.ux.action.start(`Generating test policy asset registry`)
        const { stdout, stderr } = await execp('cd backend && npm run gen:test-registry && cd..')
        const registry: GeneratedRegistryData = JSON.parse(stdout.split("JSON_DATA#BEGIN|")[1].split("|JSON_DATA#END")[0])
        CliUx.ux.action.stop()
        return registry
    }

    async saveEnvFile(envData: any): Promise<void> {
        CliUx.ux.action.start(`Saving .env file`)
        const envFileContent = Object.keys(envData).map(key => `${key}=${envData[key]}`).join("\n")
        await writeFile(".wiz/backend/.env", envFileContent)
        CliUx.ux.action.stop("Done, now you can run 'wiz dev' to run a local DDU App. You can find the generated .env file at .wiz/backend/.env")
    }

    public async run(): Promise<void> {
        await this.verifyValidWorkingEnvironment()
        const { args, flags } = await this.parse(Genenv)

        await steps.setupWizStructure()
        await this.verifyBackendEnvFile()
        await this.installNpmDependencies("backend")
        await this.installNpmDependencies("frontend")
        await this.promptBlockFrostRequirement()
        await this.promptBlockFrostAccountCreation()
        const BLOCKFROST_API_KEY = await this.requestBlockFrostApiKey()
        await this.promptDiscordAppCreation()
        const DISCORD_CLIENT_ID = await this.requestDiscordClientID()
        const DISCORD_CLIENT_SECRET = await this.requestDiscordSecret()
        await this.promptNGrokRequirement()
        const registry = await this.generateAssetRegistry()

        const envFileValues: EnvFile = {
            DB_HOST: "localhost",
            DB_PORT: "5432",
            DB_USERNAME: "postgres",
            DB_PASSWORD: "admin",
            DB_DATABASE: "service_db",
            SECRET_KEY: "secret-key",
            BLOCKFROST_API_KEY,
            DISCORD_CLIENT_ID,
            DISCORD_CLIENT_SECRET,
            DISCORD_REDIRECT_URI_VALIDATE: "http://localhost:3000/discordValidate",
            DISCORD_REDIRECT_URI_ADD: "http://localhost:3000/discordAdd",
            CORS_ORIGIN: "http://localhost:3000",
            POLICY_DRAGON_SILVER: registry.policies.dragonSilver,
            POLICY_PIXEL_TILES: registry.policies.pixelTiles,
            POLICY_GMAS: registry.policies.gmas,
            POLICY_THIOLDEN: registry.policies.thiolden,
            POLICY_EMOJIS: registry.policies.emojis,
            POLICY_SLIMES: registry.policies.slimes,
            POLICY_FURNITURE: registry.policies.furniture,
            ENCRYPTION_PASSWORD: registry.password,
            ENCRYPTED_REGISTRY: registry.registry,
        }
        await this.saveEnvFile(envFileValues)
    }
}