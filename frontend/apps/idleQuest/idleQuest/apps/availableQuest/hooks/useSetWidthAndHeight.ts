import { useGeneralDispatch } from "../../../../../../features/hooks"
import { useEffect, useState } from "react"
import { useGetRandomNumber } from "."
import { setPositionAvailableQuest } from "../features/availableQuest"
import { propPosition } from "../../../../../idleQuest/settings"


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

export default (data: AvailableQuest , position: number) : (number | null) [] =>{

    const generalDispatch = useGeneralDispatch()
    
    const currentPositionHeight = propPosition[position].height 
    const currentPositionWidth = propPosition[position].width     

    const height = useGetRandomNumber(currentPositionHeight[0], currentPositionHeight[1]) 
    const width = useGetRandomNumber(currentPositionWidth[0], currentPositionWidth[1])
    const [ widthState, setWidthState ] = useState<number | null>(null)
    const [ heightState, setHeightState ] = useState<number | null>(null)


    //este efecto se activa cada vez que hay un cambio de state y setea el heigth y el width evitando que se cambie de posicion una vez montado
    useEffect(() => {
        if(data.width == undefined && data.height == undefined ){ 
            generalDispatch(setPositionAvailableQuest({uiid: data.uiid!, width: width, height: height}))
        }
    })

    //una vez que ya se seteo el width and height se manda al state general
    useEffect(() => {
        if(data.width != undefined && data.height != undefined){
            setWidthState(data.width)
            setHeightState(data.height)          
        }
    }, [data.height, data.width])

    return [width, height, widthState, heightState ]

}