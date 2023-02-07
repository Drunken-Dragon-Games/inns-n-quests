import { useEffect, useState } from "react"
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { setDeleteAvailableQuest } from "../features/availableQuest"
import { setTakenIdReset } from "../features/availableQuest"
import { AvailableQuestType } from "../../../../../../types/idleQuest" 


export default ( data : AvailableQuestType ) : boolean => {

    //este efecto se activa cuando un quest ha sido tomado y si es el mismo quest renderizada en este element activa la animacion de salida
    const [ isClose, setIsClose ] = useState<boolean>(false)

    const generalSelector = useGeneralSelector(selectGeneralReducer)    

    const generalDispatch = useGeneralDispatch()
    
    const questTaken = generalSelector.idleQuest.questAvailable.data.takenId.id

    useEffect(()=>{

        if( questTaken != null ){
            if(data.uiid !== undefined){
                if( questTaken == data.uiid ){
                    setIsClose(true)
                }
            }
        }
    },[questTaken])


    //este effecto si activa cuando se activa el estado de salida la animacion
    useEffect(()=>{

        if(isClose == true){
            setTimeout(function(){
                generalDispatch(setDeleteAvailableQuest((questTaken!)))
                generalDispatch(setTakenIdReset())
                
            }, 650);
        }

    },[isClose])


    return isClose
}