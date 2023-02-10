import { useEffect, useState } from "react"
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { removeAvailableQuest } from "../features/quest-board"
import { setTakenIdReset } from "../features/quest-board"
import { LocalAvailableQuest } from "../../../../../../types/idleQuest" 


export default ( data : LocalAvailableQuest ) : boolean => {

    //este efecto se activa cuando un quest ha sido tomado y si es el mismo quest renderizada en este element activa la animacion de salida
    const [ isClose, setIsClose ] = useState<boolean>(false)

    const generalSelector = useGeneralSelector(selectGeneralReducer)    

    const generalDispatch = useGeneralDispatch()
    
    const questTaken = generalSelector.idleQuests.questBoard.data.takenId.id

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
                generalDispatch(removeAvailableQuest((questTaken!)))
                generalDispatch(setTakenIdReset())
                
            }, 650);
        }

    },[isClose])


    return isClose
}