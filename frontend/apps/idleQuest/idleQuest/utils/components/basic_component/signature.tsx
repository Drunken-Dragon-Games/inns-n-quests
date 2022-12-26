import style from "styled-components"
import Image from 'next/image'
import { useGeneralSelector } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"
import { useState } from "react"
import { ConditionalRender } from "../../../../../utils/components/basic_components"

interface SignatureWrapper {
    notClickable?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    hover? : boolean
}

const SignatureWrapper = style.div<SignatureWrapper>`
    position: absolute;
    bottom: 1.5vw;
    left: 4vw;
    cursor: ${props => props.notClickable  ? "context-menu": "pointer"};
    
    
    img{
        width: 11vw !important;
        height: 2vw !important;
        img{
            width: 9vw !important;
            height: 2.1vw !important;

        }
    }

    p{
        width: 9vw; 
        font-size: 1vw;
        color: #D99F59;
        font-family: VT323;
        position: absolute;
        top: 0.6vw;
        left:${props => props.notClickable  ? " 2.5": "3.5"}vw;
        opacity: ${props => props.hover  ? "0.5": "1"};
    }
`

const SignatureImageWrapper = style.div`
    position: absolute;
    bottom: -0.2vw;
    left: 3vw;
    img{
        width: 9vw !important;
        height: 2.1vw !important;
    }
`

interface Signature {
    available?: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement> & React.MouseEventHandler<HTMLButtonElement>,
}

const Signature = ({available, onClick}: Signature) => {

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const [ onHover,setOnHover ] = useState<boolean>(false)   
    const numberAdventurers = generalSelector.idleQuest.questAvailable.data.selectAdventurer.selectAdventurer.length
    

    if(available){

        return(
            <>
                <ConditionalRender condition ={numberAdventurers > 0}>
                    <SignatureWrapper onClick={onClick} onMouseLeave ={ () => setOnHover(false)} onMouseOver = {() => setOnHover(true)} hover={onHover} >
                        <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png"  alt = "signature" width={2000} height={1250} />
                        <p>Tap here to sign</p>
                    </SignatureWrapper>
                </ConditionalRender>
    
                <ConditionalRender condition ={numberAdventurers == 0}>
                    <SignatureWrapper notClickable = {true}>
                        <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png"  alt = "signature" width={2000} height={1250} />
                        <p>choose any adventurer</p>
                    </SignatureWrapper>
                </ConditionalRender>
            </>
        )
    }

    return(
        <>
            <SignatureWrapper notClickable = {true}>
                <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png"  alt = "signature" width={2000} height={1250} />
                <SignatureImageWrapper>
                    <Image src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/signature/drunken_dragon_signature.webp"  alt = "signature" width={20000} height={12500} />
                </SignatureImageWrapper>
            </SignatureWrapper>
            
        </>
    )
}

export default Signature