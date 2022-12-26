import styled from "styled-components" 
import { useSelector, useDispatch } from 'react-redux'
import Image from "next/image"
import { useState } from "react"
import { CountEffect } from "./"
import { TextElMessiri, ConditionalRender } from '../../../../../../utils/components/basic_components';

interface ClaimRewardButton{
    isClickable: boolean
}

const ClaimRewardButton = styled.div<ClaimRewardButton>`
    display: flex;
    padding: 0.15vw 0.7vw 0.2vw 0.2vw;
    background-color: ${props => props.isClickable ?  "#16232E": "#808080"};
    border: 0.15vw solid ${props => props.isClickable ?  "#475261": "#808080"};
    border-radius: 0.4vw;
    cursor: ${props => props.isClickable ?  "pointer": ""};
    border-radius: 1vw 1vw 1vw 1vw;

    ${props => props.isClickable ?  "&:hover{ background-color:  #475261;}": ""}
    

`

const DragonSilverWrapperToClaim = styled.div`
    display: flex;
    width: 4vw;
    p{
        margin-left: 0.5vw;
        margin-top: 0.12vw;
    }
`

const ImageWrapper = styled.div`
    display: block;
    width: 1.5vw;
    height: 1.5vw;
    position: relative;
`
interface ToolTip{
    Hover: boolean
}

const ToolTipDragonSilverToClaim = styled.span<ToolTip>`
    position: absolute;
    background-color: white;
    padding: 0.2vw 0.5vw 0.1vw 0.5vw;
    border-radius: 0.5vw;
    top: 0vw;
    left: 2vw;
    width: 6vw;
    visibility: ${props => props.Hover ? "visible": "hidden"};
    opacity: ${props => props.Hover ? "1": "0"};
    transition: opacity 0.5s, visibility 0.5s;
    z-index: 2;
`

interface ClaimDragonSilverButton{
    src: string
    dragonSilver: number
    tooltip: string
    toClaim?: boolean
}

const DragonSilverIcon = ({src, dragonSilver, tooltip, toClaim} : ClaimDragonSilverButton) => {

    // const generalSelector = useSelector(selectGeneralPageReducer)
    // const dispatch = useDispatch()

    // const dragonSilverToClaim = generalSelector.player.data.dragonSilver.toClaim
   
    const [ onHoverDragonSilverToClaim, setOnHoverDragonSilverToClaim ] = useState<boolean>(false) 

    
    return(<>

                <DragonSilverWrapperToClaim>

                    <ImageWrapper>
                        <Image 
                            src= {src}
                            alt="Dragon silver to claim icon" 
                            width={30} 
                            height={30}  
                            layout="responsive"
                            onMouseOver ={() => setOnHoverDragonSilverToClaim(true)} 
                            onMouseLeave ={() => setOnHoverDragonSilverToClaim(false)}
                        />
                        <ToolTipDragonSilverToClaim Hover={onHoverDragonSilverToClaim}><TextElMessiri fontsize={0.9} color="#23303B">{tooltip}</TextElMessiri></ToolTipDragonSilverToClaim>
                    </ImageWrapper>

                    <ConditionalRender condition ={toClaim ==true}>
                        <CountEffect/>
                    </ConditionalRender>

                    <ConditionalRender condition ={toClaim ==false}>
                        <TextElMessiri  fontsize={0.9} color="white">{dragonSilver}</TextElMessiri>
                    </ConditionalRender>
                    
                </DragonSilverWrapperToClaim>
    </>)
}

export default DragonSilverIcon