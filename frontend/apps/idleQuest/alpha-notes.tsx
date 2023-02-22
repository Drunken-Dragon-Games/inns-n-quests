import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { PixelFontFamily } from "./common-components"

const date = "22 Feb 2023"

const notes = [
    "'Q' to toggle the quest board.",
    "'M' to toggle Thiolden's map.",
    "'B' to toggle the inventory.",
    "* A first implementation of the Inn is working.",
    "* Use A W S D keys to move around.",
    "* Click + Space + Drag Mouse to move around.",
    "* Try dragging an adventurer, he will follow you around and collide with walls.", 
    "* This is just a proof of concept.",
    "Thank you for testing Idle Adventures!",
    "- Vledic"
]

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`

const AlphaNotesContainer = styled.div<{ open: boolean }>`
    position: absolute;
    z-index: 15;
    margin: 1vmax;
    top: 0;
    right: 0;
    width: 20vmax;
    padding: 1vmax;
    background: white;
    ${PixelFontFamily}
    color: black;
    border-radius: 1vmax;
    box-shadow: 0 0 0.5vmax 0.1vmax rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 0.5vmax;
    ${props => props.open ? "top: 0;" : "top: -100vh;"}
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
`

const AlphaNotesTitle = styled.div`
    font-size: 1.5vmax;
    font-weight: bold;
`

const AlphaNotesHeader = styled.div`
    display: flex;
`

const Push = styled.div`
    flex: 1;
`

const Close = styled.div`
    font-size: 1.5vmax;
    font-weight: bold;
    cursor: pointer;
    &:hover { text-shadow: 0 0 0.5vmax 0.3vmax rgba(0, 0, 0, 0.5); }
`

const AlphaNotesDate = styled.div`
    font-size: 1vmax;
    color: rgb(20,20,20)
`

const AlphaNotesContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5vmax;
`

const AlphaNote = styled.div`
    font-size: 1.2vmax;
`

const AlphaNotes = () => {
    const [open, setOpen] = useState(true)
    return (
        <AlphaNotesContainer open={open}>
            <AlphaNotesHeader>
                <AlphaNotesTitle>Alpha Notes</AlphaNotesTitle>
                <Push/>
                <Close onClick={() => setOpen(false)}>X</Close>
            </AlphaNotesHeader>
            <AlphaNotesDate>{date}</AlphaNotesDate>
            <AlphaNotesContent>
            {notes.map((note, index) => 
                <AlphaNote key={index}>{note}</AlphaNote>
            )}
            </AlphaNotesContent>
        </AlphaNotesContainer>
    )
}

export default AlphaNotes
