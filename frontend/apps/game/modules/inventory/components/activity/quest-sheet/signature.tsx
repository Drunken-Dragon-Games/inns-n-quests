import { useState } from "react"
import style, { keyframes } from "styled-components"
import { PixelArtImage, vh1, vw } from "../../../../../../common"

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

    @media (max-width: 1024px) {
        height: 10vw;
        width: 50vw;
        p{
            font-size: 6vw;
            margin-top: 2.5vw;
            margin-left: 10.1vw;
        }
    }
`

const SignatureImage = style(PixelArtImage)`
    bottom: -0.4vh;
    left: 6vh;

    @media (max-width: 1024px) {
        bottom: -0.6vw;
        left: 4.5vw;
    }
`

interface SignatureProps {
    isMobile: boolean
    signatureType: "in-progress" | "finished" | "claimed" | "available-no-adventurers" | "available"
    onClick?: React.MouseEventHandler<HTMLDivElement> & React.MouseEventHandler<HTMLButtonElement>,
}

const Background = () => 
    <PixelArtImage 
        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png" 
        alt="signature" 
        fill 
        absolute 
    />

const Signature = ({ isMobile, signatureType, onClick }: SignatureProps) => {
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
                    units={isMobile ? vw(3.5): vh1 }
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