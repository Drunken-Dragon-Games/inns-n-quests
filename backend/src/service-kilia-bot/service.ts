import { Client, Events, GatewayIntentBits, CommandInteraction, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Message, MessageCollector, TextChannel } from "discord.js"
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v9"
import { EvenstatsEvent, EvenstatsService, EvenstatsSubscriber, QuestSucceededEntry } from "../service-evenstats"
import { Character, IdleQuestsService, TakenStakingQuest, Leaderboard } from "../service-idle-quests"
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
import { ConfirmMessage } from "./models"
import { LoggingContext } from "../tools-tracing"
import { CollectionService } from "../service-collection"


export type KiliaBotServiceDependencies = {
    database: Sequelize
    evenstatsService: EvenstatsService,
    identityService: IdentityService,
    governanceService: GovernanceService,
    idleQuestsService: IdleQuestsService,
    collectionService: CollectionService,
}

export type KiliaBotServiceConfig = {
    token: string,
    serverId: string
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
    
    const kilia = new SlashCommandBuilder()
        .setName("kilia")
        .setDescription("Request Kilia for information, legends or songs...")
        .addSubcommand(subcommand => subcommand
            .setName("leaderboard")
            .setDescription("Ask about this month's most successfull Inns."))
        .toJSON()

    return [kiliaConfig, kilia]
}


export class KiliaBotServiceDsl implements EvenstatsSubscriber {

    private readonly migrator: Umzug<QueryInterface>
    private readonly configCache: { [ key: string ]: configDB.IConfigDB } = {}
    private readonly logger = LoggingContext.create("kilia")

    constructor(
        private readonly database: Sequelize,
        private readonly client: Client,
        private readonly identityService: IdentityService,
        private readonly governanceService: GovernanceService,
        private readonly idleQuestService: IdleQuestsService,
        private readonly serverId: string,
        private readonly collectionService: CollectionService,
    ){
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: KiliaBotServiceDependencies): Promise<KiliaBotServiceDsl | undefined> {
        const token = config.stringOrElse("KILIA_BOT_TOKEN", "unset")
        const serverId = config.stringOrError("KILIA_SERVER_ID")
        if (token === "unset") return undefined
        return await KiliaBotServiceDsl.loadFromConfig({
            token,
            serverId
        }, dependencies)
    }

    static async loadFromConfig(config: KiliaBotServiceConfig, dependencies: KiliaBotServiceDependencies): Promise<KiliaBotServiceDsl> {
        //const client = new Client({ intents: GatewayIntentBits.Guilds })
        const client = new Client({intents: ["Guilds", "GuildMessages", "MessageContent"]})
        const service = new KiliaBotServiceDsl(
            dependencies.database, 
            client,
            dependencies.identityService,
            dependencies.governanceService,
            dependencies.idleQuestsService,
            config.serverId,
            dependencies.collectionService,
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
            /* case "quests-succeeded-leaderboard-changed-event": 
                return this.notifyQuestsSucceededLeaderboardChanged(event.leaderboard) */
        }
    }

    async onDiscordBotEvent(interaction: CommandInteraction): Promise<void> {
        switch (interaction.commandName) {
            case "kilia-config": return this.commandConfig(interaction)
            case "kilia": return this.publicCommand(interaction)
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
            .setTitle(`${player.info.nickname} (${player.info.knownDiscord}) just ${success} ${quest.availableQuest.name}!`)
            .setDescription(`${ player.status !== "ok" ? "" : `[Visit Inn](https://ddu.gg/inn/${player.info.knownDiscord}) \n `}${quest.availableQuest.description}`)
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

    //DEPRECATED
    async notifyQuestsSucceededLeaderboardChanged(leaderboard: QuestSucceededEntry[]): Promise<void> {
        /* const servers = Object.values(this.configCache)

        const players = await this.identityService.resolveUsers(leaderboard.map((position) => position.userId))

        const withPlayers = leaderboard.map((position, index) => ({ player: players[index], count: position.count }))

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
        } */
    }

    async commandConfig(interaction: CommandInteraction): Promise<void> {
        if (!interaction.isChatInputCommand()) return
        if(!interaction.memberPermissions?.has("Administrator")) return

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

    async publicCommand(interaction: CommandInteraction): Promise<void> {
        if (!interaction.isChatInputCommand()) return

        const subcommand = interaction.options.getSubcommand()
    
        if (subcommand === "leaderboard") {
            const startDate = new Date()
            startDate.setDate(1)
            startDate.setHours(0)
            startDate.setMinutes(0)
            startDate.setSeconds(0)

            const leaderboard = await this.idleQuestService.getStakingQuestLeaderboard(10, startDate)
            if(leaderboard.length < 1) {
                await interaction.reply("Ah, adventurers! The ink's still wet on this month's tales. No quests to rank yet!")
                return
            }
            const embedFields = await Promise.all(leaderboard.map(async (entry, index) => {
                const user = await this.identityService.resolveUser({ ctype: "user-id", userId: entry.userId })
                return {
                    name: `${index + 1}. ${user.status !== "ok" ? "Anon" : `${user.info.nickname} (${user.info.knownDiscord})`}`,
                    value: `${ user.status !== "ok" ? "" : `[Visit Inn](https://ddu.gg/inn/${user.info.knownDiscord}) | `}${entry.succeededQuests} quests succeeded.`
                }
              }))
            const descriptionArray = ["Between you and me, these are the best...",
             `Here they are. I'm rooting for ${embedFields[Math.floor(Math.random() * embedFields.length)].name}!`,
            "Between you and me, these are the most extraordinary adventures of our land!",
            "Behold, the crème de la crème..."]
            const embed = new EmbedBuilder()
            .setColor(0x1999B3)
            .setTitle(`Leaderboard for ${startDate.toLocaleString('default', { month: 'long' })}`)
            .setDescription(descriptionArray[Math.floor(Math.random() * descriptionArray.length )])
            .addFields(embedFields)
            await interaction.reply({ embeds: [ embed ] })
            return
        }
        else return await this.reply(interaction, "Kilia unknokwn command")
        
    }

    async commandGovernance(message: Message): Promise<void> {
        if (!this.verifyAdminChannel(message, "governanceAdminChannelId")) return await this.replyMessage(message, "The command could not be verified to have come from a registered governance channel or server.")
        const subcommand = messagesDSL.getSubCommand(message)

        if (subcommand === "add") {
            const ballotInput = messagesDSL.getArguments(message)
            const ballotResult = ballotDSL.parseBallotInput(ballotInput)
            if (ballotResult.status !== "ok") return this.replyMessage(message, ballotResult.reason)
            
            await this.replyMessage(message, ballotDSL.genBallotPreview(ballotResult.payload))

            await this.waitForConfirmation(message, 60,
                {
                    cancel: 'Ballot confirmation canceled. No changes were made.',
                    timeout: 'Ballot confirmation timed out. No changes were made.'
                },
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
        else if (subcommand == "help") {
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
        const subcommand = messagesDSL.getSubCommand(message)
        if (subcommand == "get-server-id") 
            return await this.replyMessage(message, (this.configCache[message.guildId!]).serverId)
        else if (!this.verifyAdminChannel(message, "devAdminChannelId")) 
            return await this.replyMessage(message, "The command could not be verified to have come from a registered development channel or server.")
        else if (subcommand === "user-id") {
            const discordName = messagesDSL.getArguments(message)
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
        else if (subcommand == "normalize-single-asset-by-ref") {
            const [userId, assetRef] = messagesDSL.getArguments(message).split(" ")

            if (!userId || !assetRef ) return this.replyMessage(message, "could not get all parameters")

            const result = await this.idleQuestService.normalizeSingleAssetStatus(userId, {ctype: "ref", assetRef})
            return this.replyMessage(message,  result.status == "ok" ? "Status succesfully updated" : `Could not update ${result.reason}`)

        }
        else if (subcommand == "normalize-single-asset-by-id") {
            const [userId, assetId] = messagesDSL.getArguments(message).split(" ")

            if (!userId || !assetId ) return this.replyMessage(message, "could not get all parameters")

            const result = await this.idleQuestService.normalizeSingleAssetStatus(userId, {ctype: "id", assetId})
            return this.replyMessage(message,  result.status == "ok" ? "Status succesfully updated" : `Could not update ${result.reason}`)

        }
        else if (subcommand == "fail-quest"){
            const [userId, takenQuestId] = messagesDSL.getArguments(message).split(" ")
            if (!userId || !takenQuestId ) return this.replyMessage(message, "could not get all parameters")
            const result = await this.idleQuestService.failStakingQuest(userId, takenQuestId)
            return this.replyMessage(message,  result.status == "ok" ? 
            `Succesfully failed quest that had a party of 
            ${JSON.stringify(result.missionParty)}` : 
            `Could not update ${result.reason}`)
        }
        else if (subcommand == "get-ballot-votes"){
            const ballotId = messagesDSL.getArguments(message)
            const ballotOptions = await this.governanceService.getBallotVotes(ballotId)
        
            ballotOptions.forEach(async (option) => {
                const stakeVotes = await Promise.all(option.votes.map(async (vote) => {
                        const voteUser = await this.identityService.resolveUser({ ctype: "user-id", userId: vote.userId })
                        const dragonGold = parseInt(vote.dragonGold, 10) / 1_000_000
                        if (voteUser.status !== "ok") return ""
                        return `userId: ${voteUser.info.userId}, stakeAddresses: ${voteUser.info.knownStakeAddresses.join(", ")}, dragonGold: ${dragonGold.toFixed(6)}`
                }))
                this.replyMessage(message, 
                    `Option ${option.option} has a total of ${option.votes.length} votes:
                    
                    ${stakeVotes.join(`
                    `)}
                    `
                    )
            })

        }
        else if (subcommand == "get-leaderboard"){
            const days = messagesDSL.getArguments(message)
            let leaderboard: Leaderboard = []
            let startDate: Date 
            if (!days || days == ""){
                //we default to the first of the previus month
                const currentDate = new Date()
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                const  endDate =  new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
                leaderboard = await this.idleQuestService.getStakingQuestLeaderboard(10, startDate, endDate)   
            }
            else{
                const daysToCheck = parseInt(days)
                if (isNaN(daysToCheck) || daysToCheck <= 0) {return this.replyMessage(message, "Invalid input for days.")}
                const currentDate = new Date()
                startDate = new Date(currentDate.getTime() - daysToCheck * 24 * 60 * 60 * 1000)
                leaderboard = await this.idleQuestService.getStakingQuestLeaderboard(10, startDate)
            }
              
              const embedFields = await Promise.all(leaderboard.map(async (entry, index) => {
                const user = await this.identityService.resolveUser({ ctype: "user-id", userId: entry.userId })
                if (user.status !== "ok") this.replyMessage(message, `could not find user under id ${entry.userId}`)
                return {
                    name: `${index + 1}. ${user.status !== "ok" ? "Anon" : `${user.info.nickname} (${user.info.knownDiscord})`}`,
                    value: `${ user.status !== "ok" ? "" : `[Visit Inn](https://ddu.gg/inn/${user.info.knownDiscord}) | `}${entry.succeededQuests} quests succeeded`
                }
              }))
              
              this.replyMessage(message, `Leadeboard status is ${JSON.stringify(embedFields, null, 4)}
              \nDo you whant to publish this to the public channel? \nPlease confirm by replying with **yes**. If you wish to cancel, reply with **no** or wait for 60 seconds for this request to time out.`)


            await this.waitForConfirmation(message, 60,
                {
                    cancel: 'Leaderboard Publish confirmation canceled.',
                    timeout: 'Leaderboard Publish confirmation timed out.'
                },
                async () => {
                    const servers = Object.values(this.configCache)
                    const embed = new EmbedBuilder()
                    .setColor(0x1999B3)
                    .setTitle(`Leaderboard for ${startDate.toLocaleString('default', { month: 'long' })} Published!`)
                    .setDescription("The most successful Inn Keepers of Thiolden.")
                    .addFields(embedFields)

                    for (const server of servers) {
                        if (!server.leaderboardNotificationChannelId) continue
                        const channel = this.client.channels.resolve(server.leaderboardNotificationChannelId)
                        if (!channel || !channel.isTextBased()) continue
                        await channel.send({ embeds: [ embed ] })
                    }
                    return `Leaderboard Published on the leaderboard Notification Channel `
                })
        }
        else if (subcommand == "clear-week-stake"){
            if (process.env.NODE_ENV !== "development") return this.replyMessage(message, "Comand only allowed on devleopemnt enviroments")
            const [weekNo, year] = messagesDSL.getArguments(message).split(" ")
            if (weekNo == "" || year == "") return this.replyMessage(message, "could not get week from arguments")
            const weekNoNum = Number(weekNo)
            const yearNum = Number(year)

            if (isNaN(weekNoNum) || weekNoNum < 1 || weekNoNum > 53) {
                return this.replyMessage(message, "Week number must be a number between 1 and 53")
            }
            if (isNaN(yearNum) || yearNum < 2022 ) {
                return this.replyMessage(message, "Year must be a number stating with 2022 ")
            }
            const clearResult = await this.collectionService.clearWeekStake(weekNoNum, yearNum)
            if (clearResult.ctype !== "success") return this.replyMessage(message, `Error clearing ${clearResult.error}`)
            return this.replyMessage(message, `Done!`)
        }
        else if (subcommand == "set-collection-lock"){
            const lockedString = messagesDSL.getArguments(message)
            console.log({lockedString})
            const locked = lockedString === "true" ||  lockedString === "True" ||  lockedString === "t" ? true :  lockedString === "false" ||  lockedString === "False" ||  lockedString === "f" ? false : undefined
            if (locked === undefined) return this.replyMessage(message, "Could not parse boolean state please use comand wiht either **true** or **false**")
            this.replyMessage(message, `Got command to set all users collections locked to be ${locked} fi this is correct reply with **yes** If you wish to cancel, reply with **no** or wait for 60 seconds for this request to time out.`)
            await this.waitForConfirmation(message, 60,
                {
                    cancel: 'Colleciton set confirmation canceled.',
                    timeout: 'Colleciton set confirmation timed out.'
                },
                async () => {
                    try{
                        await this.collectionService.setLockAllUsersCollections(locked)
                        return `Collecitons succesfully set to ${locked ? "Locked" : "unlokced"}`
                    }
                    catch(e: any){
                        return JSON.stringify(e, null, 4)
                    }
                })
        }
        else if (subcommand == "help"){
            const helpMessage = `
        **Available Development Commands**
        
        *user-id <discordName>* : Returns the user ID of the given Discord name.
        
        *user-info <userId>* : Returns detailed information for the given user ID.
        
        *total-users* : Returns the total number of users in the system.

        *normalize-single-asset-by-ref <userId> <assetRef> * : Checks whether the specified asset for a user is in a quest. 
            If not, it resets the asset's activity status to false.

        *normalize-single-asset-by-id <userId> <entityId> * : Checks whether the specified asset for a user is in a quest. 
            If not, it resets the asset's activity status to false.
        
        *fail-quest <userId> <takenQuestId> * : Sets a Quest outcome to failed and sets the party memebers activity to false, returns an array of the party entityIds.
            If needed also retuns array of orphaned entitiesIds that could not be found on the Database.
        
        *get-ballot-votes <ballotId> *: Returns the votes for a ballot, separated by option

        *get-leaderboard <days?>*: Retrieves the leaderboard information for the specified number of days. if no day is provided it defaults to the first of the current month
            it promts for confirmation to publish leaderboard to the public channel

        *clear-week-stake <weekNumber> <year>: Removes the records for granting rewrds for a given week. only works if the env is set to development

        *set-collection-lock* <state>: Sets all users collections to the provided state
        
        *help* : Provides a list of available commands and a description of their function.
        
        To use these commands, prefix the command with a '!dev '.`
            return await this.replyMessage(message, helpMessage)
        }
        else return await this.replyMessage(message, `unknown development command ${subcommand}`)
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
            if (server.serverId !== this.serverId) continue
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
    private async waitForConfirmation(message: Message, TTL: number, mesages: ConfirmMessage, preloadedCallback: () => Promise<string | void>) {
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
                return this.serverId === message.guildId && this.configCache[message.guildId][Chanelkey] === message.channelId
            } else {
                return false;
            }
        } catch (e: any) {
            this.logger.log.error(`Error when trying to check ${Chanelkey} ${JSON.stringify(e, null, 4)}`);
            return false;
        }
    }
}

