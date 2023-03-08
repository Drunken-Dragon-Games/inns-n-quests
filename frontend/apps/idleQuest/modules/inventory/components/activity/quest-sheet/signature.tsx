import { useState } from "react"
import style, { keyframes } from "styled-components"
import { PixelArtImage } from "../../../../../common"

const glow = keyframes`
    100% {text-shadow: 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2); }
`

const SignatureContainer = style.div<{ interactuable?: boolean, hover?: boolean, glow?: boolean }>`
    margin-top: auto;
    position: relative;
    height: 4vh;
    width: 20vh;
    cursor: ${props => props.interactuable ? "pointer" : "context-menu"};
    animation: ${props => props.glow ? glow : ""} 0.5s ease-in-out infinite alternate;
    p{
        font-size: 2vh;
        color: #D99F59;
        font-family: VT323;
        margin-top: 1.5vh;
        margin-left:${props => props.interactuable ? "4" : "4"}vh;
        opacity: ${props => props.hover ? "0.5": "1"};
    }
`

const SignatureImage = style(PixelArtImage)`
    bottom: -0.4vh;
    left: 3vh;
`

interface Signature {
    signatureType: "in-progress" | "finished" | "claimed" | "available-no-adventurers" | "available"
    onClick?: React.MouseEventHandler<HTMLDivElement> & React.MouseEventHandler<HTMLButtonElement>,
}

const Background = () => 
    <PixelArtImage src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png" alt="signature" fill absolute />

const Signature = ({ signatureType, onClick }: Signature) => {
    const [hover, setOnHover] = useState<boolean>(false)
    if (signatureType == "available")//available")
        return (
            <SignatureContainer onClick={onClick} onMouseLeave={() => setOnHover(false)} onMouseOver={() => setOnHover(true)} hover={hover} interactuable >
                <Background />                
                <p>Tap here to sign</p>
            </SignatureContainer>
        )
    else if (signatureType == "available-no-adventurers")
        return (
            <SignatureContainer>
                <Background />
                <p>Pick adventurers</p>
            </SignatureContainer>
        )
    else if (signatureType == "finished")
        return (
            <SignatureContainer onClick={onClick} onMouseLeave={() => setOnHover(false)} onMouseOver={() => setOnHover(true)} hover={hover} interactuable glow>
                <Background />
                <p>Complete quest</p>
            </SignatureContainer>
        )
    else if (signatureType == "in-progress")
        return (
            <SignatureContainer>
                <Background />
                <SignatureImage
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/signature/drunken_dragon_signature.webp" 
                    alt="signature" 
                    width={12} height={3} 
                    absolute
                />
            </SignatureContainer>
        )
    else 
        return (
            <SignatureContainer onClick={onClick} onMouseLeave={() => setOnHover(false)} onMouseOver={() => setOnHover(true)} hover={hover} interactuable glow>
                <Background />
                <p>Close quest</p>
            </SignatureContainer>
        )
}

export default Signature