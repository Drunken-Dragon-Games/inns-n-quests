import { QueryInterface, Sequelize } from "sequelize"
import { EvenstatsEvent, Leaderboard, EvenstatsSubscriber, QuestSucceededEntry } from "./models"
import { EvenstatsService } from "./service-spec"

import * as leaderboardDB from "./leaderboard/leaderboard-db"
import { Umzug } from "umzug"
import path from "path"
import { buildMigrator } from "../tools-database"
import { TakenQuest } from "../service-idle-quests"

export type EvenstatsServiceDependencies = {
    database: Sequelize
}

export type EvenstatsServiceConfig = {
}

export class EvenstatsServiceDsl implements EvenstatsService {

    private readonly migrator: Umzug<QueryInterface>
    private readonly leaderboardCache: Leaderboard = { questsSucceeded: [] }
    private subscribers: { [ key: string ]: EvenstatsSubscriber[] } = {}

    constructor(
        private readonly database: Sequelize,
    ) {
        const migrationsPath: string = path.join(__dirname, "migrations").replace(/\\/g, "/")
        this.migrator = buildMigrator(database, migrationsPath)
    }

    static async loadFromEnv(dependencies: EvenstatsServiceDependencies): Promise<EvenstatsServiceDsl> {
        return EvenstatsServiceDsl.loadFromConfig({}, dependencies)
    }

    static async loadFromConfig(config: EvenstatsServiceConfig, dependencies: EvenstatsServiceDependencies): Promise<EvenstatsServiceDsl> {
        const service = new EvenstatsServiceDsl(
            dependencies.database, 
        )
        await service.loadDatabaseModels()
        return service
    }

    async loadDatabaseModels(): Promise<void> {
        leaderboardDB.configureSequelizeModel(this.database)
        await this.migrator.up()
        const loadedLeaderboard = await leaderboardDB.LeaderboardDB.findAll()
        loadedLeaderboard.forEach(position => this.leaderboardCache.questsSucceeded
            .push({ userId: position.userId, count: position.questsSucceeded }))
    }

    async unloadDatabaseModels(): Promise<void> {
        await this.migrator.down()
    }

    subscribe(subscriber: EvenstatsSubscriber, ...events: EvenstatsEvent["ctype"][]): void {
        events.forEach(event => {
            if (!this.subscribers[event]) {
                this.subscribers[event] = []
            }
            this.subscribers[event].push(subscriber)
        })
    }

    async publish(event: EvenstatsEvent): Promise<void> {
        const subscribers = this.subscribers[event.ctype]
        if (subscribers) 
            await Promise.all(subscribers.map(subscriber => subscriber.onEvenstatsEvent(event)))
        if (event.ctype === "claimed-quest-event" && event.quest.outcome && event.quest.outcome.ctype === "success-outcome")
            await this.updateQuestsSucceededLeaderboard(event.quest.userId)
    }

    private async updateQuestsSucceededLeaderboard(userId: string): Promise<void> {
        const oldTop10 = this.leaderboardCache.questsSucceeded.slice(0, 10)
        const entry = this.leaderboardCache.questsSucceeded.find(position => position.userId === userId)
        entry ? entry.count++ : this.leaderboardCache.questsSucceeded.push({ userId, count: 1 })
        await leaderboardDB.LeaderboardDB.upsert({ userId, questsSucceeded: entry ? entry.count : 1 })
        this.leaderboardCache.questsSucceeded.sort((a, b) => b.count - a.count)
        const newTop10 = this.leaderboardCache.questsSucceeded.slice(0, 10)
        const changed = oldTop10.map(p => p.userId).join() !== newTop10.map(p => p.userId).join()
        if (changed) this.publish({ ctype: "quests-succeeded-leaderboard-changed-event", leaderboard: newTop10 })
    }
}