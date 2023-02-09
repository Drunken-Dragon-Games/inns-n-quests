import { QuestRequirement} from "../basic_component"
import { useGetRequirementText } from "../../../apps/availableQuest/hooks"
import { ConditionalRender } from "../../../../../utils/components/basic_components"
import { RequirementType, CharacterType } from "../../../../../../types/idleQuest"

interface questRequirementsSection{
    requirements: RequirementType 
    adventuresSelected: any
}



const QuestRequirementsSection = ({requirements, adventuresSelected} : questRequirementsSection) =>{
    
    const text = useGetRequirementText(requirements)

    //si el objeto esta vacio no renderiza nada 
    if(Object.keys(requirements).length == 0){
        return <></>
    }


    return(<>

            <ConditionalRender condition={requirements.all == undefined }>
                {
                    requirements.character!.map((requirementData: CharacterType, index: number )=>{
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