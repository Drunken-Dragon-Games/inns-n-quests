import { Client, Events, GatewayIntentBits, CommandInteraction, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Message, MessageCollector, TextChannel } from "discord.js"
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v9"
import { EvenstatsEvent, Leaderboard, EvenstatsService, EvenstatsSubscriber, QuestSucceededEntry } from "../service-evenstats.js"
import { Character, TakenStakingQuest } from "../service-idle-quests.js"
import { config } from "../tools-utils.js"
import { QueryInterface, Sequelize } from "sequelize"

import * as configDB from "./config/config-db.js"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database.js"
import path from "path"
import { IdentityService } from "../service-identity.js"
import { GovernanceService } from "../service-governance/service-spec.js"

//not sure how you would like me to manage this, mor info on the files themselves
import * as messagesDSL from "./discord-messages-dsl.js"
import * as ballotDSL from "./ballots/ballot-dsl.js"
import { ConfirmMessagge, registerBallotType } from "./models.js"


export type KiliaBotServiceDependencies = {
    database: Sequelize
    evenstatsService: EvenstatsService,
    identityService: IdentityService,
    governanceService: GovernanceService
}

export type KiliaBotServiceConfig = {
    token: string,
}

type Command = RESTPostAPIChatInputApplicationCommandsJSONBody

const slashCommandsBuilder = (): Command[] => {
    const kiliaConfig = new SlashCommandBuilder()
        .setName("kilia-config")
        .setDescription("Configure Kilia.")
        .addSubcommand(subcommand => subcommand
            .setName("quests-channel")
            .setDescription("Set the channel where quests notifications will be sent.")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("The channel where notifications will be sent.")))
        .addSubcommand(subcommand => subcommand
            .setName("leaderboard-channel")
            .setDescription("Set the channel where the leaderboard updates will be sent.")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("The channel where notifications will be sent.")))
        .addSubcommand(subcommand => subcommand
            .setName("governance-admin-channel")
            .setDescription("Set the channel where governance questions will be posted.")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("The channel where governance questions will be posted.")
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName("development-admin-channel")
            .setDescription("Set the channel where developer reports will be posted.")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("The channel where developer reports will be posted.")
                .setRequired(true)))
        .toJSON()

    return [kiliaConfig];
}


export class KiliaBotServiceDsl implements EvenstatsSubscriber {

    private readonly migrator: Umzug<QueryInterface>
    private readonly configCache: { [ key: string ]: configDB.IConfigDB } = {}

    constructor(
        private readonly database: Sequelize,
        private readonly client: Client,
        private readonly identityService: IdentityService,
        private readonly governanceService: GovernanceService
    ){
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: KiliaBotServiceDependencies): Promise<KiliaBotServiceDsl | undefined> {
        const token = config.stringOrElse("KILIA_BOT_TOKEN", "unset")
        if (token === "unset") return undefined
        return await KiliaBotServiceDsl.loadFromConfig({
            token,
        }, dependencies)
    }

    static async loadFromConfig(config: KiliaBotServiceConfig, dependencies: KiliaBotServiceDependencies): Promise<KiliaBotServiceDsl> {
        //const client = new Client({ intents: GatewayIntentBits.Guilds })
        const client = new Client({intents: ["Guilds", "GuildMessages", "MessageContent"]})
        const service = new KiliaBotServiceDsl(
            dependencies.database, 
            client,
            dependencies.identityService,
            dependencies.governanceService
        )
        //setting up DB and pre loading cache
        await service.loadDatabaseModels()
        dependencies.evenstatsService.subscribe(service, 
            "claimed-quest-event",
            "quests-succeeded-leaderboard-changed-event",
        )
        client.once(Events.ClientReady, async (client) => {
            if (!client.user) return
            await client.application.commands.set(slashCommandsBuilder())
            console.log(`${client.user.tag} is ready to listen and sing!`)
            console.log(`Invite link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
        })
        
        client.login(config.token)
        client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isCommand()) return
            try { service.onDiscordBotEvent(interaction) } 
            catch (error) {
                console.error(error)
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
            }
        })

        client.on("messageCreate", async (message) => {
            if (message.author.bot || !message.content.startsWith("!")) return
            try { service.onDiscordBangEvent(message) } 
            catch (error) {
                console.error(error)
                await message.reply({ content: "There was an error while executing this command!"})
            }
        })
        return service
    }
    private onDiscordBangEvent(message: Message) {
        switch (messagesDSL.getCommand(message)) {
            case "ballot": return this.commandGovernance(message)
            case "dev": return this.commandDevelopment(message)
        }
    }

    async loadDatabaseModels(): Promise<void> {
        configDB.configureSequelizeModel(this.database)
        await this.migrator.up()
        const loadedConfig: configDB.ConfigDB[] = await configDB.ConfigDB.findAll()
        loadedConfig.forEach(config => this.configCache[config.serverId] = config.dataValues)
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
    }

    async onEvenstatsEvent(event: EvenstatsEvent): Promise<void> {
        switch (event.ctype) {
            case "claimed-quest-event": 
                return this.notifyQuestClaimed(event.quest, event.adventurers)
            case "quests-succeeded-leaderboard-changed-event": 
                return this.notifyQuestsSucceededLeaderboardChanged(event.leaderboard)
        }
    }

    async onDiscordBotEvent(interaction: CommandInteraction): Promise<void> {
        switch (interaction.commandName) {
            case "kilia-config": return this.commandConfig(interaction)
        }
    }

    async notifyQuestClaimed(quest: TakenStakingQuest, adventurers: Character[]): Promise<void> {
        const servers = Object.values(this.configCache)
        const player = await this.identityService.resolveUser({ ctype: "user-id", userId: quest.userId })
        if (player.status !== "ok" || !quest.outcome) return

        const success = quest.outcome.ctype === "success-outcome" ? "succeeded" : "failed"
        //const outcome = quest.outcome.ctype === "success-outcome" ? quest.outcome.reward.currencies[0]!.unit : quest.outcome!.reason
        const embed = new EmbedBuilder()
            .setColor(0xF5CD1B)
            .setTitle(`${player.info.nickname} just ${success} ${quest.availableQuest.name}!`)
            .setDescription(quest.availableQuest.description)
            .addFields(
                { name: "Adventurers", value: adventurers.map(a => `${a.name}`).join(", ") },
            )

        for (const server of servers) {
            if (!server.questsNotificationChannelId) continue
            const channel = this.client.channels.resolve(server.questsNotificationChannelId)
            if (!channel || !channel.isTextBased()) continue
            await channel.send({ embeds: [ embed ] })
        }
    }

    async notifyQuestsSucceededLeaderboardChanged(leaderboard: QuestSucceededEntry[]): Promise<void> {
        const servers = Object.values(this.configCache)

        const players = await this.identityService.resolveUsers(
            leaderboard.map((position) => position.userId))
        const withPlayers = leaderboard.map((position, index) =>
            ({ player: players[index], count: position.count }))
        const embedFields = withPlayers.map((position, index) => 
            ({ name: `${index+1}. ${position.player.nickname}`, value: `${position.count} quests succeeded` }))

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Leaderboard changed!`)
            .setDescription("The most successful Character Inn Keepers of Thiolden. \n (These are notifications from the Idle Quests @Council of Elronidas alpha tests, if you want to join please ask an @Inkeepers on how to join the council!)")
            .addFields(embedFields)

        for (const server of servers) {
            if (!server.leaderboardNotificationChannelId) continue
            const channel = this.client.channels.resolve(server.leaderboardNotificationChannelId)
            if (!channel || !channel.isTextBased()) continue
            await channel.send({ embeds: [ embed ] })
        }
    }

    async commandConfig(interaction: CommandInteraction): Promise<void> {
        if (!interaction.isChatInputCommand()) return
        const subcommand = interaction.options.getSubcommand()
    
        if (subcommand === "quests-channel") return await this.reply(interaction, await this.setChannel(interaction, "questsNotificationChannelId"))
        else if (subcommand === "leaderboard-channel") return await this.reply(interaction, await this.setChannel(interaction, "leaderboardNotificationChannelId"))
        else if (subcommand === "governance-admin-channel") return await this.reply(interaction, await this.setChannel(interaction, "governanceAdminChannelId"))
        else if (subcommand === "development-admin-channel") return await this.reply(interaction, await this.setChannel(interaction, "devAdminChannelId"))
        else return await this.reply(interaction, "Kilia-config unknokwn command")
        
    }

    private async setChannel (interaction: CommandInteraction, channelIdKey: configDB.KiliaChannelsNames): Promise<string> {
        if (!interaction.isChatInputCommand()) return "Interaction is not a chat input command"
        const channel = interaction.options.getChannel("channel")
        if (!channel || !interaction.guildId) return "Channel not found or not in a server."
        if (!this.configCache[interaction.guildId]) this.configCache[interaction.guildId] = { serverId: interaction.guildId }
        this.configCache[interaction.guildId][channelIdKey] = channel.id;
        await configDB.ConfigDB.upsert({ serverId: interaction.guildId, [channelIdKey]: channel.id});

        if (channelIdKey == "governanceAdminChannelId") return `${channel.name} set as Governance Admin channel`
        else if (channelIdKey == "leaderboardNotificationChannelId") return `${channel.name} set as Leaderboard channel`
        else if (channelIdKey == "questsNotificationChannelId") return `${channel.name} set as Quests channel`
        else if (channelIdKey == "devAdminChannelId") return `${channel.name} set as Development Admin channel`
        else return "Unknown Kilia-config command"
    }

    async commandGovernance(message: Message): Promise<void> {
        if (!this.verifyAdminChannel(message, "governanceAdminChannelId")) return await this.replyMessage(message, "The command could not be verified to have come from a registered governance channel or server.")
        const subcommand = messagesDSL.getSubCommand(message)

        if (subcommand === "add") {
            const ballotInput = messagesDSL.getArguments(message)
            const ballotResult = ballotDSL.parseBallotInput(ballotInput)
            if (ballotResult.status !== "ok") return this.replyMessage(message, ballotResult.reason)
            
            await this.replyMessage(message, ballotDSL.genBallotPreview(ballotResult.payload))

            await this.waitForconfirmation(message, 60, 
                {cancel: 'Ballot confirmation canceled. No changes were made.', 
                timeout: 'Ballot confirmation timed out. No changes were made.' },
                 async () => {
                    const r = await this.governanceService.addBallot(ballotResult.payload)
                    if (r.ctype !== "success") return r.reason
                    return `Ballot confirmed and stored successfully under ID ${r.ballotId}`
                 })

        }
        else if (subcommand === "get") {
            const ballotResult = await this.governanceService.getBallot(messagesDSL.getArguments(message))
            if (ballotResult.ctype !== "succes") return await this.replyMessage(message, ballotResult.reason)
            return await this.replyMessage(message, ballotDSL.formatStoredBallot(ballotResult.ballot))

        }
        else if (subcommand == "close") {
            const ballotId = messagesDSL.getArguments(message)
            const ballotResult = await this.governanceService.closeBallot(ballotId)
            if (ballotResult.ctype !== "success") return await this.replyMessage(message, ballotResult.reason)
            return await this.replyMessage(message, `Ballot ${ballotId} closed successfully. Winners:
                \`\`\`json
                ${JSON.stringify(ballotResult.winners, null, 4)}
                \`\`\`
            `)
        }
        else if (subcommand == "list") {
            const ballotResult = await this.governanceService.getAdminBallotCollection()
            if (ballotResult.ctype !== "success") return await this.replyMessage(message, ballotResult.reason)
            return await this.replyMessage(message, ballotDSL.formatList(ballotResult.ballots))
        }
        else if (subcommand == "help"){
            const helpMessage = `
        **Available Governance Commands**
        
        *add <ballotInput>* : Adds a new ballot with the given input.
        
        *get <ballotId>* : Retrieves detailed information for the specified ballot ID.
        
        *close <ballotId>* : Closes the specified ballot and announces the winners.
        
        *list* : Lists all the current ballots in the system.
        
        *help* : Provides a list of available commands and a description of their function.
        
        To use these commands, prefix the command with a '!ballot '.`
            return await this.replyMessage(message, helpMessage)
        }
        
        else return await this.replyMessage(message, "unknown governance command")
    }

    async commandDevelopment(message: Message): Promise<void> {
        if (!this.verifyAdminChannel(message, "devAdminChannelId")) return await this.replyMessage(message, "The command could not be verified to have come from a registered development channel or server.")
        const subcommand = messagesDSL.getSubCommand(message)
        if (subcommand === "user-id") {
            const discordName = messagesDSL.getArguments(message)
            console.log(discordName)
            const user = await this.identityService.resolveUser({ctype: "nickname", nickname: discordName})
            if (user.status !== "ok") return await this.replyMessage(message, "could not find disocrd Name")
            return await this.replyMessage(message, `UserId ${user.info.userId}`)
        }
        else if (subcommand === "user-info") {
            const userId = messagesDSL.getArguments(message)
            const user = await this.identityService.resolveUser({ctype: "user-id", userId})
            if (user.status !== "ok") return await this.replyMessage(message, "could not find user ID")
            return await this.replyMessage(message, `UserId ${JSON.stringify(user.info, null, 4)}`)

        }
        else if (subcommand == "total-users") {
            //I migth a bit more info to this later but righ now i just whant access to this info
            const totalUsers = await this.identityService.getTotalUsers()
            return await this.replyMessage(message, totalUsers.toString())
        }
        else if (subcommand == "help"){
            const helpMessage = `
        **Available Development Commands**
        
        *user-id <discordName>* : Returns the user ID of the given Discord name.
        
        *user-info <userId>* : Returns detailed information for the given user ID.
        
        *total-users* : Returns the total number of users in the system.
        
        *help* : Provides a list of available commands and a description of their function.
        
        To use these commands, prefix the command with a '!dev '.`
            return await this.replyMessage(message, helpMessage)
        }
        else return await this.replyMessage(message, "unknown development command")
    }

    sendErrorMessage(error: Error, route: string, method: string, traceId?: string, userId?: string){
        const servers = Object.values(this.configCache)
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`The backend server encountered an error`)
            .setDescription(error.message ? "The error provided the following message:" : "However, the error did not include a specific message. Here is the full error detail:")
            .addFields(
                { name: "Error:", value: error.message ? error.message : JSON.stringify(error, null, 4) },
                { name: "Request Method", value: method},
                { name: "Route:", value: route },
                { name: "Trace Id", value: traceId ?? "No Trace Id supplied"},
                { name: "User Id", value: userId ?? "No User Id supplied"},
            )
        for (const server of servers) {
            if (!server.devAdminChannelId) continue
            const channel = this.client.channels.resolve(server.devAdminChannelId)
            if (!channel || !channel.isTextBased()) continue
            channel.send({ embeds: [ embed ] })
        }
     }

    //added this function just so could do a return void to the reply method, cuss i thinks it reads a million times nicer
    private async reply(interaction: ChatInputCommandInteraction, messagge: string): Promise<void>{
        await interaction.reply(messagge)
        return
    }

    private async replyMessage(message: Message, content: string): Promise<void> {
        await message.reply(content)
      }

    /**
     * 
     * @param message Discord message that requires confirmation
     * @param TTL Time in seconds for confirmation to timeout
     * @param mesages mesagges to send on confirm, cancel and timeout. if no confirm message is provided preloadedCallback string response is used
     * @param preloadedCallback function to be called on confirmation
     */
    private async waitForconfirmation(message: Message, TTL: number, mesages: ConfirmMessagge, preloadedCallback: () => Promise<string | void>) {
    const filterYesNo = (m: Message) => m.author.id === message.author.id && ['yes', 'no'].includes(m.content.toLowerCase())

        const collector = new MessageCollector(message.channel, { filter: filterYesNo, time: TTL * 1000})

        collector.on('collect', async (m: Message) => {
            if (m.content.toLowerCase() === 'yes') {

                const reponse = await preloadedCallback()
                if (mesages.confirm) await this.replyMessage( message, mesages.confirm)
                else if (reponse) await this.replyMessage( message, reponse)
                else await this.replyMessage( message, "Message confirmed")
            } 
            else await this.replyMessage( message, mesages.cancel)
            collector.stop()
        })

        collector.on('end', (collected, reason) => { if (reason === 'time') 
            { this.replyMessage( message, mesages.timeout)}})
    }

    private verifyAdminChannel(message: Message, Chanelkey: configDB.KiliaChannelsNames): Boolean {
        try {
            if (message.channelId && message.guildId) {
                return this.configCache[message.guildId][Chanelkey] === message.channelId;
            } else {
                return false;
            }
        } catch (e: any) {
            console.log(`Error when trying to check ${Chanelkey} ${JSON.stringify(e, null, 4)}`);
            return false;
        }
    }
    

    
}

