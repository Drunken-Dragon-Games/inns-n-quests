import style, { keyframes } from "styled-components"
import { useState } from "react"
import { CrispPixelArtImage } from "../../../../../utils"

const glow = keyframes`
    100% {text-shadow: 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.2); }
`

const SignatureWrapper = style.div<{ interactuable?: boolean, hover?: boolean, glow?: boolean }>`
    position: absolute;
    top: 40vmax;
    left: 4vmax;
    cursor: ${props => props.interactuable ? "pointer" : "context-menu"};
    animation: ${props => props.glow ? glow : ""} 0.5s ease-in-out infinite alternate;
    img{
        width: 11vmax !important;
        height: 2vmax !important;
        img{
            width: 9vmax !important;
            height: 2.1vmax !important;

        }
    }

    p{
        width: 9vmax; 
        font-size: 1vmax;
        color: #D99F59;
        font-family: VT323;
        position: absolute;
        top: 0.6vmax;
        left:${props => props.interactuable ? "3.5" : " 2.5"}vmax;
        opacity: ${props => props.hover ? "0.5": "1"};
    }
`

const SignatureImageWrapper = style.div`
    position: absolute;
    bottom: -0.2vmax;
    left: 3vmax;
    img{
        width: 9vmax !important;
        height: 2.1vmax !important;
    }
`

interface Signature {
    signatureType: "in-progress" | "finished" | "available-no-adventurers" | "available"
    onClick?: React.MouseEventHandler<HTMLDivElement> & React.MouseEventHandler<HTMLButtonElement>,
}

const Signature = ({ signatureType: questType, onClick }: Signature) => {
    const [hover, setOnHover] = useState<boolean>(false)
    if (questType == "available")
        return (
            <SignatureWrapper onClick={onClick} onMouseLeave={() => setOnHover(false)} onMouseOver={() => setOnHover(true)} hover={hover} interactuable >
                <CrispPixelArtImage src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png" alt="signature" width={2000} height={1250} />
                <p>Tap here to sign</p>
            </SignatureWrapper>
        )
    else if (questType == "available-no-adventurers")
        return (
            <SignatureWrapper interactuable={false}>
                <CrispPixelArtImage src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png" alt="signature" width={2000} height={1250} />
                <p>Pick adventurers</p>
            </SignatureWrapper>
        )
    else if (questType == "finished")
        return (
            <SignatureWrapper onClick={onClick} onMouseLeave={() => setOnHover(false)} onMouseOver={() => setOnHover(true)} hover={hover} interactuable glow>
                <CrispPixelArtImage src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png" alt="signature" width={2000} height={1250} />
                <p>Complete quest</p>
            </SignatureWrapper>
        )
    else //questType == "in-progress"
        return (
            <SignatureWrapper interactuable={false}>
                <CrispPixelArtImage src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/signature.png" alt="signature" width={2000} height={1250} />
                <SignatureImageWrapper>
                    <CrispPixelArtImage src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/signature/drunken_dragon_signature.webp" alt="signature" width={20000} height={12500} />
                </SignatureImageWrapper>
            </SignatureWrapper>
        )
}

export default Signature