import util from 'util'
import { exec } from 'child_process'
import { Command, Flags, CliUx } from '@oclif/core'
import { rm } from 'fs/promises'
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
    DISCORD_SECRET: string,
    DISCORD_REDIRECT_URI_VALIDATE: string,
    DISCORD_REDIRECT_URI_ADD: string,
    CORS_ORIGIN: string,
    ENCRYPTION_PASSWORD: string,
    ENCRYPTED_REGISTRY: string,
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
                message: 'The backend .env file already exists, would you like to replace it?',
                type: 'confirm',
            }])
            if (answers['replace-env-file']) {
                await rm(".wiz/backend/.env")
                await steps.createWizBackendEnvFile(this.config.platform)
            }
        } catch(e) {
            await steps.createWizBackendEnvFile(this.config.platform)
        }
    }

    async installNpmDependencies(subdirectory: "backend" | "frontend"): Promise<void> {
        CliUx.ux.action.start(`Installing ${subdirectory} npm dependencies`)
        await execp(`cd ${subdirectory} && npm install`)
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
            message: 'INFO: The Drunken Dragon Universe App dev environment requires ngrok to redirect the Discord OAuth2 callbacks to your local machine (you don\'t need to install it if you are not using the local dev environment). Press enter to continue...',
            type: 'confirm',
        }])
        if (!answers['ngrok-requirement']) {
            this.log("The Drunken Dragon Universe App requires ngrok to be installed. Please install it and run the wizard again.")
            this.exit(1)
        }
    }

    async promptForDiscordConfiguration(): Promise<void> {
        const answers = await inquirer.prompt([{
            name: 'configure-discord',
            message: 'Go back to the Discord OAuth2 tab and add the following redirect URIs at the "Redirects" section: http://localhost:3000/discordValidate and http://localhost:3000/discordAdd. Press enter to continue.',
            type: 'confirm',
        }])
        if (!answers['configure-discord']) {
            this.log("The Drunken Dragon Universe App requires the Discord OAuth2 redirect URIs to be configured. Please configure them and run the wizard again.")
            this.exit(1)
        }
    }

    public async run(): Promise<void> {
        await this.verifyValidWorkingEnvironment()
        const { args, flags } = await this.parse(Genenv)

        /*
        await steps.setupWizStructure()
        await this.verifyBackendEnvFile()
        await this.installNpmDependencies("backend")
        await this.installNpmDependencies("frontend")
        */
        await this.promptBlockFrostRequirement()
        await this.promptBlockFrostAccountCreation()
        const BLOCKFROST_API_KEY = await this.requestBlockFrostApiKey()
        await this.promptDiscordAppCreation()
        const DISCORD_CLIENT_ID = await this.requestDiscordClientID()
        const DISCORD_SECRET = await this.requestDiscordSecret()
        await this.promptNGrokRequirement()
        await this.promptForDiscordConfiguration()
    }
}