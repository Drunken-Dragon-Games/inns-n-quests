import { useEffect, useState } from "react"
import { inProgressQuestType } from "../../../../../../types/idleQuest"

//recibe inProgressQuests y regresa el numero de inProgressQuest que ya estan terminados
export default (inProgressQuests: inProgressQuestType [] ): number => {
    const [questCompletedNumber, setQuestCompletedNumber] = useState(0)

    useEffect(() => {
        const questCompleted = inProgressQuests.filter(inProgressQuest => inProgressQuest.state != "in_progress" );
        const questCompletedNumber = questCompleted.length
        setQuestCompletedNumber(questCompletedNumber)
    }, [inProgressQuests])
    
    return  questCompletedNumber 
}