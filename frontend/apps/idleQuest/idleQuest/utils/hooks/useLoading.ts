import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { useEffect, useState } from "react"

export default (): boolean => {

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const getAdventurersStatus = generalSelector.idleQuests.questBoard.status.getAdventurersStatus.status
    const getAvailableQuestStatus = generalSelector.idleQuests.questBoard.status.getAvailableQuestStatus.status
    const getInProgressQuestStatus = generalSelector.idleQuests.questsInProgress.Status.inProgress.status

    useEffect(()=>{

        if((getAdventurersStatus === 'fulfilled' ||getAdventurersStatus === 'rejected') && 
        (getAvailableQuestStatus === 'fulfilled' || getAvailableQuestStatus === 'rejected') &&
        (getInProgressQuestStatus === 'fulfilled' || getInProgressQuestStatus === 'rejected')){
            setTimeout(() => setIsLoading(false), 500)
        }
    },[getAdventurersStatus, 
        getAvailableQuestStatus, 
        getInProgressQuestStatus ])

    return isLoading
}