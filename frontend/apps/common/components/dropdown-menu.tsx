import { MouseEventHandler, ReactNode, useState } from "react"
import styled from "styled-components"
import { colors } from "../common-css"

const DropdownMunuContainer = styled.div`
    position: relative;
    width: 35px;
    height: 12px;
    cursor: pointer;
    background-image: url(https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/interactButton/interact_button.svg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    &:hover {
        background-image: url(https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/interactButton/interact_button_hover.svg);
    }
`

const DropdownButton = styled.button`
    border: none;
    background-color: transparent;
    color: ${colors.textBeige};
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;

    &:hover {
        background-color: ${colors.textGray};
        color: white;
    }
`

const DropdownContent = styled.div<{ open: boolean }>`
    position: absolute;
    background-color: ${colors.dduBrackground2};
    box-shadow: 0px 8px 8px 0px rgba(0,0,0,0.2);
    border-radius: 5px;
    top: calc(100% + 5px);
    left: -25%;
    overflow: hidden;
    flex-direction: column;
    ${props => props.open ? 'display: flex' : 'display: none'}
`

interface DropdownMenuProps {
    children?: ReactNode
    buttons?: Record<string, MouseEventHandler<HTMLButtonElement>>
}

export const DropdownMenu = ({ children, buttons }: DropdownMenuProps) => {
    const [open, setOpen] = useState(false)
    return (
        <DropdownMunuContainer onClick={() => setOpen(!open)}>
            <DropdownContent open={open}>
                { children ? children :
                  buttons &&
                    Object.keys(buttons).map((button, index) => 
                        <DropdownButton key={index} onClick={buttons[button]!}>{button}</DropdownButton> 
                    )
                }
            </DropdownContent>
        </DropdownMunuContainer>
    )
}