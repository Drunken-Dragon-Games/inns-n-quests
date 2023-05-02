import { useState } from "react"
import styled, { keyframes } from "styled-components"
import { PixelFontFamily } from "../common"

const date = "5 May 2023"

const notes = [
    "'Q' to toggle the quest board.",
    "'B' to toggle the inventory.",
    "________",
    "Welcome to the open beta. You are given test assets to try the application and test its features.",
    "The objective of this open beta is to identify critical issues. Please report them on Discord if you find any.",
    "You will find some missing features or minor bugs. We will work on those after an initial mainnet release and after all critical issues have been solved.",
    "________",
    "Thank you for testing Inns & Quests and the Idle Adventures!",
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
                <AlphaNotesTitle>Beta Notes</AlphaNotesTitle>
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
