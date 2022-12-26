import { useEffect, useState } from "react"
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { setDeleteAvailableQuest } from "../features/availableQuest"

interface AvailableQuest {
    uiid?: string
    id: string
    name: string
    description: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    duration: number
    width?: number
    height?: number
}

export default ( data : AvailableQuest ) : boolean => {

    //este efecto se activa cuando un quest ha sido tomado y si es el mismo quest renderizada en este element activa la animacion de salida
    const [ isClose, setIsClose ] = useState<boolean>(false)

    const generalSelector = useGeneralSelector(selectGeneralReducer)
        
    const generalDispatch = useGeneralDispatch()
    
    // const questTaken = generalSelector.navigator.questTakenId

    const questTaken = "123123123123123124124124"

    useEffect(()=>{

        if( questTaken != null ){
            if( questTaken == data.uiid ){
                setIsClose(true)
            }
        }
    },[questTaken])


    //este effecto si activa cuando se activa el estado de salida la animacion
    useEffect(()=>{

        if(isClose == true){
            setTimeout(function(){
                // FIXME: add this dispatch
                // generalDispatch(setQuestTakenId(null))
                generalDispatch(setDeleteAvailableQuest(questTaken))
                
            }, 650);
        }

    },[isClose])


    return isClose
}