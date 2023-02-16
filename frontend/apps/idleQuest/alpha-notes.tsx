import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { PixelFontFamily } from "./components/common-css"

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

const notes = [
    "* Press 'B' to open the inventory. (Icons and buttons pending).",
    "* Now you can click on the adventurers to see their splash art, soon we will display stats there as well.",
    "* An IV/EV system is still on the works.",
    "Thank you for testing Idle Quests!",
    "- Vledic"
]

const AlphaNotes = () => {
    const [open, setOpen] = useState(true)
    return (
        <AlphaNotesContainer open={open}>
            <AlphaNotesHeader>
                <AlphaNotesTitle>Alpha Notes</AlphaNotesTitle>
                <Push/>
                <Close onClick={() => setOpen(false)}>X</Close>
            </AlphaNotesHeader>
            <AlphaNotesDate>16 Feb 2023</AlphaNotesDate>
            <AlphaNotesContent>
            {notes.map((note, index) => 
                <AlphaNote key={index}>{note}</AlphaNote>
            )}
            </AlphaNotesContent>
        </AlphaNotesContainer>
    )
}

export default AlphaNotes
