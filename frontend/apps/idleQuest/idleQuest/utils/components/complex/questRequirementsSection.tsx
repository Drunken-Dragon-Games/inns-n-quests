import { QuestRequirement} from "../basic_component"
import { useRequirementsBonus } from "../../hooks"
import { useGetRequirementText } from "../../../apps/availableQuest/hooks"
import { useEffect, useState } from "react"
import { ConditionalRender } from "../../../../../utils/components/basic_components"

interface questRequirementsSection{
    requirements: requirement 
    adventuresSelected: any
    callbackBonus: (bonus: number) => void
}

interface requirement{
    character?: character []
    all?: boolean
    party?: party
}


interface character {
    class?: string
    race?: string
}

interface party {
    balanced: boolean
}



const QuestRequirementsSection = ({requirements, adventuresSelected, callbackBonus} : questRequirementsSection) =>{
    
    const bonus = useRequirementsBonus(adventuresSelected, requirements)
    
    useEffect(() => {
        callbackBonus(bonus)
    }, [bonus])
    
    const text = useGetRequirementText(requirements)

    //si el objeto esta vacio no renderiza nada 
    if(Object.keys(requirements).length == 0){
        return <></>
    }


    return(<>

            <ConditionalRender condition={requirements.all == undefined }>
                {
                    requirements.character!.map((requirementData: character, index: number )=>{
                        const parseData = {character:[requirementData]}
                        return <QuestRequirement data={parseData} adventuresSelected={adventuresSelected} key={index}>{requirementData.race!} {requirementData.class!} needed</QuestRequirement>
                    })
                }
            </ConditionalRender>
            <ConditionalRender condition={requirements.all === true}>
                <QuestRequirement 
                    data={requirements}
                    adventuresSelected={adventuresSelected}    
                >
                    {text}
                </QuestRequirement>
            </ConditionalRender>

            <ConditionalRender condition={requirements.party !== undefined  && requirements.party.balanced == true}>
                
                <QuestRequirement
                    data={requirements}
                    adventuresSelected={adventuresSelected}
                >Balance party</QuestRequirement>
                
            </ConditionalRender>
    </>)
    
}

export default QuestRequirementsSection