import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { PixelFontFamily } from "./common-components"

const date = "17 Feb 2023"

const notes = [
    "* Press 'B' to toggle the inventory. (Icons and buttons pending).",
    "* Now you can click on the adventurers to see their splash art, soon we will display stats there as well.",
    "* A first IV/EV system is implemented.",
    "APS xp is split between the party evenly, but the individual xp is affected by the APS Initial Value (IV).",
    "A 10/10/10 will get full XP benefit, a 1/1/1 only 10% of his share of XP.",
    "The displayed APS is the Effort Value (EV).",
    "Right now quests XP reward is its APS x 100.",
    "The XP needed to level up a Stat follows a logarithmic curve. (The higher the level the harder is to level up).",
    "Death mechanics are still to be implemented.",
    "Thank you for testing Idle Quests!",
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
