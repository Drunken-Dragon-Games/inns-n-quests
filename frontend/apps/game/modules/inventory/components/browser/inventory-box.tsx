import { HTMLAttributes, ReactNode } from "react"
import styled, { css, keyframes } from "styled-components"
import { OswaldFontFamily } from "../../../../../common"

const BoxCss = css`
    box-sizing: border-box;
    overflow: visible;
    border-radius: 2px;
    padding: 3px;
    width: 100%;
    height: 100%;
`

const InventoryBoxContainer = styled.div<{ empty?: boolean, disabled?: boolean }>`
    ${BoxCss}
    position: relative;
    cursor: ${props => props.empty || props.disabled ? "default" : "pointer"};
    filter: ${props => props.disabled ? "grayscale(100%)" : "none"};
    background-color: ${props => props.empty ? "rgba(30,30,30,0.8)" : "rgba(20,20,20,0.9)" };
`

const InnerBorderBox = styled.div<{ $hover?: boolean }>`
    ${BoxCss}
    border: 2px solid ${props => props.$hover ? "rgba(255,255,255,0.7)" : "rgba(50,50,50,0.8)"};
    background-color: ${props => props.$hover ? "rgba(20,20,20,0.5)" : "rgba(0,0,0,0)"};
`

const InnerBackgroundBox = styled.div<{ $selected?: boolean, $center?: boolean, $overflowHidden?: boolean }>`
    ${BoxCss}

    position: relative;
    background-color: ${props => props.$selected ? "#1976d2" : "rgba(0,0,0,0)"};
    box-shadow: inset 0 0 10px ${props => props.$selected ? "#90caf9" : "rgba(0,0,0,0)"};
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
    right: -3px;
    bottom: -3px;
    padding: 2px;
    z-index: 3;
    background-color: rgba(20,20,20,0.9);
    border-radius: 2px;
`

const InfoInnerBox = styled.div`
    padding: 0 3px;
    border: 2px solid rgba(50,50,50,0.7);
    border-radius: 2px;
    span {
        ${OswaldFontFamily}
        font-size: 12px;
        text-align: center;
        color: white !important;
    };
`

const cornerTopLeftAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(-45deg) }
    100% { transform: translate(-4px, -4px) rotate(-45deg) }
`

const cornerTopRightAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(45deg) }
    100% { transform: translate(4px, -4px) rotate(45deg) }
`

const cornerBottomRightAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(135deg) }
    100% { transform: translate(4px, 4px) rotate(135deg) }
`

const cornerBottomLeftAnimation = keyframes`
    0% { transform: translate(0vmax, 0vmax) rotate(225deg) }
    100% { transform: translate(-4px, 4px) rotate(225deg) }
`

const CornerImage = styled.div<{ side: "top-left" | "top-right" | "bottom-right" | "bottom-left" }>`
    position: absolute;
    width: 0; 
    height: 0; 
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid white;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));

    ${props => props.side === "top-left" ? `
        top: 2px;
        left: -2px;
        transform: rotate(-45deg);
    ` : props.side === "top-right" ? `
        top: 2px;
        right: -2px;
        transform: rotate(45deg);
    ` : props.side === "bottom-right" ? `
        bottom: 2px;
        right: -2px;
        transform: rotate(135deg);
    ` : `
        bottom: 2px;
        left: -2px;
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
}

const InventoryBox = (props: InventoryBoxProps & HTMLAttributes<HTMLDivElement>) =>
    <InventoryBoxContainer {...props} >
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

export default InventoryBox
