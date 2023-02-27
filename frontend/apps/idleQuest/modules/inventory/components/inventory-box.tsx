import { MouseEventHandler, ReactNode } from "react"
import styled, { css, keyframes } from "styled-components"
import { OswaldFontFamily } from "../../../common-components"

const BoxCss = css`
    position: relative;
    overflow: visible;
    border-radius: 0.15vmax;
`

const InventoryBoxContainer = styled.div<{ $empty?: boolean, $disabled?: boolean }>`
    ${BoxCss}
    padding: 0.15vmax;
    cursor: ${props => props.$empty || props.$disabled ? "default" : "pointer"};
    filter: ${props => props.$disabled ? "grayscale(100%)" : "none"};
    background-color: ${props => props.$empty ? "rgba(30,30,30,0.8)" : "rgba(20,20,20,0.9)" };
`

const InnerBorderBox = styled.div<{ $hover?: boolean }>`
    ${BoxCss}
    padding: 0.2vmax;
    width: 100%;
    height: 100%;

    border: 0.15vmax solid ${props => props.$hover ? "rgba(255,255,255,0.7)" : "rgba(50,50,50,0.8)"};
    background-color: ${props => props.$hover ? "rgba(20,20,20,0.5)" : "rgba(0,0,0,0)"};
`

const InnerBackgroundBox = styled.div<{ $selected?: boolean, $center?: boolean, $overflowHidden?: boolean }>`
    ${BoxCss}
    width: 100%;
    height: 100%;

    background-color: ${props => props.$selected ? "#1976d2" : "rgba(0,0,0,0)"};
    box-shadow: inset 0 0 0.5vmax ${props => props.$selected ? "#90caf9" : "rgba(0,0,0,0)"};
    overflow: ${props => props.$overflowHidden ? "hidden" : "visible"};

    display: flex;
    flex-direction: column-reverse;
    align-items: center;

    ${props => props.$center && css`
        justify-content: center;
    `}
`

const ChildrenWrapper = styled.div`
    position: absolute;
    z-index: 2;
`

const InfoBox = styled.div`
    position: absolute;
    right: -0.5vmax;
    bottom: -0.5vmax;
    padding: 0.15vmax;
    z-index: 3;
    background-color: rgba(20,20,20,0.9);
    border-radius: 0.15vmax;
`

const InfoInnerBox = styled.div`
    padding: 0 0.3vmax;
    border: 0.15vmax solid rgba(50,50,50,0.7);
    border-radius: 0.15vmax;
    span {
        ${OswaldFontFamily}
        font-size: 0.8vmax;
        text-align: center;
        color: white !important;
    };
`

const cornerTopLeftAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(-45deg) }
    100% { transform: translate(-0.30vmax, -0.30vmax) rotate(-45deg) }
`

const cornerTopRightAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(45deg) }
    100% { transform: translate(0.30vmax, -0.30vmax) rotate(45deg) }
`

const cornerBottomRightAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(135deg) }
    100% { transform: translate(0.30vmax, 0.30vmax) rotate(135deg) }
`

const cornerBottomLeftAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(225deg) }
    100% { transform: translate(-0.30vmax, 0.30vmax) rotate(225deg) }
`

const CornerImage = styled.div<{ side: "top-left" | "top-right" | "bottom-right" | "bottom-left" }>`
    position: absolute;
    width: 0; 
    height: 0; 
    border-left: 0.5vmax solid transparent;
    border-right: 0.5vmax solid transparent;
    border-bottom: 0.5vmax solid white;
    box-shadow: 0 0.1vmax 0.3vmax 0 rgba(255, 255, 255, 0.5);
    border-radius: 0.2vmax;

    ${props => props.side === "top-left" ? `
        top: 0.15vmax;
        left: -0.15vmax;
        transform: rotate(-45deg);
    ` : props.side === "top-right" ? `
        top: 0.15vmax;
        right: -0.15vmax;
        transform: rotate(45deg);
    ` : props.side === "bottom-right" ? `
        bottom: 0.15vmax;
        right: -0.15vmax;
        transform: rotate(135deg);
    ` : `
        bottom: 0.15vmax;
        left: -0.15vmax;
        transform: rotate(225deg);
    `}

    animation: ${props => props.side === "top-left" ? cornerTopLeftAnimation : 
        props.side === "top-right" ? cornerTopRightAnimation : 
        props.side === "bottom-right" ? cornerBottomRightAnimation :
        cornerBottomLeftAnimation
    } 0.25s infinite ease-in-out alternate;
`

interface InventoryBoxProps {
    className?: string,
    children?: ReactNode,
    selected?: boolean,
    disabled?: boolean,
    center?: boolean,
    hover?: boolean,
    empty?: boolean,
    info?: string,
    overflowHidden?: boolean,
    onClick?:  MouseEventHandler
    onMouseDown?: MouseEventHandler
    onMouseUp?: MouseEventHandler
    onMouseEnter?: MouseEventHandler
    onMouseLeave?: MouseEventHandler
}

const InventoryBox = (props: InventoryBoxProps) => {
    return (
        <InventoryBoxContainer 
            className={props.className} 
            onClick={props.onClick} 
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseEnter={props.onMouseEnter} 
            onMouseLeave={props.onMouseLeave}
            $disabled={props.disabled}
            $empty={props.empty}
        >
            <InnerBorderBox $hover={props.hover && !props.empty && !props.disabled}>
                <InnerBackgroundBox $selected={props.selected && !props.empty && !props.disabled} $center={props.center} $overflowHidden={props.overflowHidden}>
                    <ChildrenWrapper>
                        {props.children}
                    </ChildrenWrapper>
                </InnerBackgroundBox>
                {props.info ? <InfoBox><InfoInnerBox><span>{props.info}</span></InfoInnerBox></InfoBox> : <></>}
            </InnerBorderBox>
            {props.hover && !props.empty && !props.disabled ?
                <>
                    <CornerImage side="top-left" />
                    <CornerImage side="top-right" />
                    <CornerImage side="bottom-right" />
                    <CornerImage side="bottom-left" />
                </>
                : <></>}
        </InventoryBoxContainer>
    )
}
export default InventoryBox
