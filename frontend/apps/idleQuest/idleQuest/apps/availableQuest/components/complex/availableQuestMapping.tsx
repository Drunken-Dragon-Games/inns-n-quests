import { Paper_1, Paper_2, Paper_3, Paper_4 } from "../basic_components";
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { ConditionalRender } from "../../../../../../utils/components/basic_components"
import { useGeneralDispatch } from "../../.././../../../../features/hooks"
import { setAvailableQuestSelected } from "../../../../features/interfaceNavigation"
import { AvailableQuestType } from "../../../../../../../types/idleQuest";

const AvailableQuest = () =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    
    const availableQuest = generalSelector.idleQuest.questAvailable.data.quest.shownQuest

    
    const generalDispatch = useGeneralDispatch()
        
    return (
        <>
                <ConditionalRender condition = {availableQuest.length > 0}>
                    {  availableQuest.map((el: AvailableQuestType, index: number ) => {

                        if (index == 0){
                            return <Paper_1 position = {2} data = {el} key={el.uiid} onClick={() => generalDispatch(setAvailableQuestSelected(index))} />
                        }   
                        
                        else if (index == 1){
                            return  <Paper_2 position = {4} data = {el} key={el.uiid} onClick={() =>  generalDispatch(setAvailableQuestSelected(index))}/>
                        }

                        else if (index == 2){
                            return  <Paper_3 position = {3} data = {el} key={el.uiid} onClick={() => generalDispatch(setAvailableQuestSelected(index))} />
                        }

                        else if (index == 3){
                            return  <Paper_4 position = {1} data = {el} key={el.uiid} onClick={() =>  generalDispatch(setAvailableQuestSelected(index))} />
                        } 
                        
                        else {
                            return <></>
                        }
                    })}
                </ConditionalRender>
        </>
    )
}

export default AvailableQuest