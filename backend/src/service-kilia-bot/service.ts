import { Client, Events, GatewayIntentBits, CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js"
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

export type KiliaBotServiceDependencies = {
    database: Sequelize
    evenstatsService: EvenstatsService,
    identityService: IdentityService,
}

export type KiliaBotServiceConfig = {
    token: string,
}

type Command = RESTPostAPIChatInputApplicationCommandsJSONBody

const commandsBuilder = (): Command[] => {
    const config = new SlashCommandBuilder()
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
                .setDescription("The channel where notifications will be sent."))
        ).toJSON()
    return [ config ]
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
        const client = new Client({ intents: GatewayIntentBits.Guilds })
        const service = new KiliaBotServiceDsl(
            dependencies.database, 
            client,
            dependencies.identityService,
        )
        await service.loadDatabaseModels()
        dependencies.evenstatsService.subscribe(service, 
            "claimed-quest-event",
            "quests-succeeded-leaderboard-changed-event",
        )
        client.once(Events.ClientReady, async (client) => {
            if (!client.user) return
            await client.application.commands.set(commandsBuilder())
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
        return service
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

        if (subcommand === "quests-channel") {
            const channel = interaction.options.getChannel("channel")
            if (!channel || !interaction.guildId) return
            if (!this.configCache[interaction.guildId]) this.configCache[interaction.guildId] = { serverId: interaction.guildId }
            this.configCache[interaction.guildId].questsNotificationChannelId = channel.id
            await configDB.ConfigDB.upsert({ serverId: interaction.guildId, questsNotificationChannelId: channel.id, returning: true })
            await interaction.reply(`Quests channel set to ${channel.name}`)
        } else if (subcommand === "leaderboard-channel") {
            const channel = interaction.options.getChannel("channel")
            if (!channel || !interaction.guildId) return
            if (!this.configCache[interaction.guildId]) this.configCache[interaction.guildId] = { serverId: interaction.guildId }
            this.configCache[interaction.guildId].leaderboardNotificationChannelId = channel.id
            await configDB.ConfigDB.upsert({ serverId: interaction.guildId, leaderboardNotificationChannelId: channel.id, returning: true })
            await interaction.reply(`Leaderboard channel set to ${channel.name}`)
        } else 
            await interaction.reply("Pong!")
    }
}