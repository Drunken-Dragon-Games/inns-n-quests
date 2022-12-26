import styled from "styled-components";
import { useGetHeightAndWidth, useGetHeightAndWidthAdventurerThiolden } from "../../../apps/console/hooks";
import Image from "next/image"
import { ConditionalRender } from "../../../../../explorerOfThiolden/explorerOfThioldenPage/components/basic_components";



interface PixelTilesWrapper{
    height: number
    width: number
    inQuest: boolean | undefined
    selectedInQuest: boolean | undefined
    is_alive: boolean | null | undefined
}

const PixelTilesWrapper = styled.div<PixelTilesWrapper>`
    width: ${props => props.width}vw;
    height: ${props => props.height}vw;

    img{

        width: ${props => props.width}vw !important;
        height: ${props => props.height}vw !important;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;

        ${props => props.inQuest 
            ?
                "filter: gray; /* IE6-9 */ -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: grayscale(1);"
            : ""
        }

        ${props => props.selectedInQuest 
            ?
                "filter: sepia; /* IE6-9 */ -webkit-filter: sepia(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: sepia(1);"
            : ""
        }

        ${props => props.is_alive == false
            ?
                "filter: gray; /* IE6-9 */ -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */ filter: grayscale(1);"
            : ""
        }
    }
`

interface scalingImageDate{
    src: string,
    inQuest?: boolean
    selectedInQuest?: boolean
    is_alive?: boolean | null
    type: string
}


const RescalingImg  = ({src, inQuest, selectedInQuest, is_alive, type} : scalingImageDate) => {
    
    const heightPixelTiles = useGetHeightAndWidth(src, 3.5)
    const heightGMA = useGetHeightAndWidth(src, 5.3)
    const [aotHeight, aotWidth] = useGetHeightAndWidthAdventurerThiolden(src, type)


    if(src == undefined){
        return<></>
    }
    
    return <>

        <ConditionalRender condition ={type == "pixeltile"}>
            <PixelTilesWrapper height ={heightPixelTiles} inQuest = {inQuest} selectedInQuest={selectedInQuest} is_alive = {is_alive} width={3.5}>
                <Image src= {src} alt="drunken Dragon idel adventurers" width={1000} height={1000} />
            </PixelTilesWrapper>
        </ConditionalRender>

        <ConditionalRender condition ={type == "gma"}>
            <PixelTilesWrapper height ={heightGMA} inQuest = {inQuest} selectedInQuest={selectedInQuest} is_alive = {is_alive} width={5.3}>
                <Image src= {src} alt="drunken Dragon idel adventurers" width={1000} height={1000} />
            </PixelTilesWrapper>
        </ConditionalRender>

        <ConditionalRender condition ={type == "aot"}>
            <PixelTilesWrapper height ={aotHeight} inQuest = {inQuest} selectedInQuest={selectedInQuest} is_alive = {is_alive} width={aotWidth}>
                <Image src= {src} alt="drunken Dragon idle adventurers" width={1000} height={1000} />
            </PixelTilesWrapper>
        </ConditionalRender>
        
    </>
}

export default RescalingImg