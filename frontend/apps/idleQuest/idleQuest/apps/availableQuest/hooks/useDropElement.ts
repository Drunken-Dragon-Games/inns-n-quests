import {  useDrop } from "react-dnd";
import { useState, useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"


interface DataAdventurer{
    id: string,
    src: string,
    experience: number,
    type: string
}

export default (index: number, reset: boolean) => {
    const [ adventurer, SetAdventurer ] = useState<string>("")
    const generalDispatch = useGeneralDispatch()
    const [ experience, setExperience] = useState<number>(0)
    const [ type, SetType ] = useState<string>("")

    useEffect(()=>{
        if(reset == false){
            SetAdventurer("")
            setExperience(0)
        }
    },[reset])


    const [{isOver}, drop] = useDrop(() => ({
        accept: "adventurer",
        drop: (item: DataAdventurer) => addBox(item.id, item.src, item.experience, item.type),
        collect:(monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const addBox = (id: string, src: string, experience: number, type: string) =>{
        SetAdventurer(src)
        // generalDispatch(setSelectAdventurerDrag({index: index , id, unSelect: false}))
        setExperience(experience)
        SetType(type)
    }

    const removeBox = () => {
        SetAdventurer("")
        // generalDispatch(setSelectAdventurerDrag({index: index , unSelect: true}))
        setExperience(0)
    }

    return {drop, adventurer, experience, type, removeBox} 
}