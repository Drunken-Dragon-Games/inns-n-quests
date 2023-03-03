import { Sequelize } from "sequelize"
import { TakenQuest } from "../service-idle-quests"
import { connectToDB } from "../tools-database"
import { EvenstatsEvent, EvenstatsSubscriber, QuestSucceededEntry } from "./models"
import { EvenstatsServiceDsl } from "./service"
import { EvenstatsService } from "./service-spec"

class EventAccumulator implements EvenstatsSubscriber {
    events: EvenstatsEvent[] = []
    async onEvenstatsEvent(event: EvenstatsEvent): Promise<void> { this.events.push(event) }
}

let service: EvenstatsService
let database: Sequelize
let accumulator: EventAccumulator 

beforeAll(async () => {
    database = connectToDB({
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "admin",
        database: "service_db"
    })
    service = new EvenstatsServiceDsl(database)
})

afterAll(async () => {
    await database.close()
})

beforeEach(async () => {
    await service.loadDatabaseModels()
    accumulator = new EventAccumulator()
    service.subscribe(accumulator, "quests-succeeded-leaderboard-changed-event")
})

afterEach(async () => {
    await service.unloadDatabaseModels()
})

const mockTakenQuest = (userId: string): TakenQuest => ({
    takenQuestId: "taken-quest1",
    userId,
    availableQuest: {
        questId: "quest1",
        name: "Quest",
        location: "Auristar",
        description: "Description",
        requirements: { ctype: "empty-requirement" },
        reward: {},
        duration: 1,
        slots: 1,
    },
    adventurerIds: [],
    claimedAt: new Date(),
    createdAt: new Date(),
    outcome: { ctype: "success-outcome", reward: {}  },
})

const mockClaimedQuestEvent = (userId: string): EvenstatsEvent => ({
    ctype: "claimed-quest-event",
    quest: mockTakenQuest(userId),
    adventurers: [],
})

const leaderBoardChanged = (leaderboard: QuestSucceededEntry[]): EvenstatsEvent => ({
    ctype: "quests-succeeded-leaderboard-changed-event",
    leaderboard,
})

test("Succeeded quests leaderboard", async () => {
    const user1 = "ae991e8c-361f-44e9-afbc-461fb94be2fa"
    const user2 = "be991e8c-361f-44e9-afbc-461fb94be2fa"

    await service.publish(mockClaimedQuestEvent(user1))
    const events1 = accumulator.events[0]
    expect(events1).toStrictEqual(leaderBoardChanged([
        { userId: user1, count: 1 },
    ]))

    await service.publish(mockClaimedQuestEvent(user2))
    const events2 = accumulator.events[1]
    expect(events2).toStrictEqual(leaderBoardChanged([
        { userId: user1, count: 1 },
        { userId: user2, count: 1 },
    ]))

    await service.publish(mockClaimedQuestEvent(user2))
    const events3 = accumulator.events[2]
    expect(events3).toStrictEqual(leaderBoardChanged([
        { userId: user2, count: 2 },
        { userId: user1, count: 1 },
    ]))
})