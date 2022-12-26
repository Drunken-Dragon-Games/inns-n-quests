import styled from "styled-components"
import { useState } from "react"
import Image from "next/image"

const ButtonContainer = styled.div`
    width: 5vw;
    height: 5vw;

    @media only screen and (max-width: 414px) {
        width: 15vw;
        height: 15vw;    
    }
`

const PlayButton = () : JSX.Element =>{

    const [ hover, setHover] = useState<boolean>(false)

    return(<>
        <ButtonContainer onMouseOver = {() => setHover(true)} onMouseLeave = {() => setHover(false)} >
            <Image src = { hover == true ? "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/play_button/play_button_hover.svg" : "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/play_button/play_button.svg"} alt ="play button" width = {5} height = {5} layout="responsive" />
        </ButtonContainer>
    </>)
}

export default PlayButton