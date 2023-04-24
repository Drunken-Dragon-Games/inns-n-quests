import { Client, Events, GatewayIntentBits, CommandInteraction, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Message, MessageCollector } from "discord.js"
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v9"
import { EvenstatsEvent, Leaderboard, EvenstatsService, EvenstatsSubscriber, QuestSucceededEntry } from "../service-evenstats"
import { Character, TakenStakingQuest } from "../service-idle-quests"
import { config } from "../tools-utils"
import { QueryInterface, Sequelize } from "sequelize"

import * as configDB from "./config/config-db"
import { Umzug } from "umzug"
import { buildMigrator } from "../tools-database"
import path from "path"
import { IdentityService } from "../service-identity"
import { GovernanceService } from "../service-governance/service-spec"

//not sure how you would like me to manage this, mor info on the files themselves
import * as messagesDSL from "./discord-messages-dsl"
import * as ballotDSL from "./ballots/ballot-dsl"
import { ConfirmMessagge } from "./models"


export type KiliaBotServiceDependencies = {
    database: Sequelize
    evenstatsService: EvenstatsService,
    identityService: IdentityService,
    //governanceService: GovernanceService
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
        else return await this.reply(interaction, "Kilia-config command unknokwn")
        
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
        else return "Unknown Kilia-config command"
    }

    async commandGovernance(message: Message): Promise<void> {
        const subcommand = messagesDSL.getSubCommand(message)
        if (subcommand === "add") {
      
            if (!message.channelId || !message.guildId) return await this.replyMessage(message, "Channel or server could not be verified")
            if (this.configCache[message.guildId].governanceAdminChannelId !== message.channelId) return await this.replyMessage(message, "Command not sent from a registered governance admin channel.")
            
            const preprocessedArgsString = messagesDSL.preprocessYAML(messagesDSL.getArguments(message))

            const ballotResult = ballotDSL.parseBallotYML(preprocessedArgsString)
            if (ballotResult.status !== "ok") return this.replyMessage(message, ballotResult.reason)
            
            await this.replyMessage(message, ballotDSL.genBallotPreview(ballotResult.payload))

            await this.waitForconfirmation(message, 60, 
                {cancel: 'Ballot confirmation canceled. No changes were made.', 
                timeout: 'Ballot confirmation timed out. No changes were made.' },
                 async () => "Ballot confirmed and stored successfully.")

        } 
        else return await this.replyMessage(message, "unknown governance command")
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
       * @param message 
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
}

