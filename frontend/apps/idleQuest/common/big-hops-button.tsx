import { MouseEventHandler } from "react"
import styled from "styled-components"

const Container = styled.div`
    width: 7vmax;
    height: 2vmax;
    display: flex;
    cursor: pointer;
    background-size: 100% 100%;
    background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/create_adventures_button/boton_inactivo.webp");
    &:hover{
        background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/create_adventures_button/boton_activo.webp");
    }
`

const Text = styled.p`
    margin: auto;
    font-weight: bold;
    font-family: El Messiri;
    font-size: 0.7vmax; 
    color white;
    text-shadow: 0px 0px 3px #000000;
    user-select: none;
    &:hover{
        color: rgb(200, 160, 70);
    }
`

interface BigHopsButtonProps {
    className?: string
    onClick?: MouseEventHandler 
    text?: string
}

const BigHopsButton = (props: BigHopsButtonProps) =>{
    return (
        <Container onClick={props.onClick}>
            <Text>{props.text}</Text>
        </Container>
    )
}

export default BigHopsButton