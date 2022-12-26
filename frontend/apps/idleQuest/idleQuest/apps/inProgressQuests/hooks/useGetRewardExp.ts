import { useState, useEffect } from "react"

interface exp_given {
    experience: number
    id: string
}

//recibe el adventurerId un array the rewardList y delay output la nueva expriencia
export default (adventurerId: string, rewardList: exp_given [] | null, delay: number) : number | null => {

    const [ newExperience, setNewExperience] = useState<number | null>(null)


    useEffect(() => {
        getAdventurerRewardExperience();
    },[rewardList])

    const getAdventurerRewardExperience = ()  =>{

        //si el reward es diferente a null usa el reducer
        if(rewardList != null){
            const newExperience = rewardList.reduce ((acc: number [], originalElement: exp_given) =>{

                if(originalElement.id == adventurerId){
                        return [originalElement.experience]
                }
            
                    return acc
            
            }, [])
        
            // para detonar la animacion
            const isClaimed = setTimeout(function(){
                setNewExperience(newExperience[0])
            }, delay);
            
        }
    }
    
    
    

    return newExperience

}
