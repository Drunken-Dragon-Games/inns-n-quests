import { Adventurer, AvailableQuest } from "../models"

const generateAvailableQuest = (idleAdventurers: Adventurer[]): AvailableQuest => {

    

    return {
        name: "Quest 1",
        description: "",
        requirements: {
            ctype: "aps-requirement",
            athleticism: 10,
            intellect: 10,
            charisma: 10,
        },
        duration: 1000,
        slots: 3,
    }
}
