import { useEffect, useState } from "react"
import { TakenQuest, takenQuestStatus } from "../../../../dsl";

//recibe inProgressQuests y regresa el numero de inProgressQuest que ya estan terminados
export default (inProgressQuests: TakenQuest[] ): number => {
    const [questCompletedNumber, setQuestCompletedNumber] = useState(0)

    useEffect(() => {
        const questCompleted = inProgressQuests.filter(inProgressQuest => takenQuestStatus(inProgressQuest) != "in-progress" );
        const questCompletedNumber = questCompleted.length
        setQuestCompletedNumber(questCompletedNumber)
    }, [inProgressQuests])
    
    return  questCompletedNumber 
}