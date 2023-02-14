import { ReactNode } from "react"
import styled from "styled-components"
import { NoDragImage } from "../../../utils"

const InventoryBoxContainer = styled.div`
    position: relative;
    width: 100%;
    cursor:pointer;
    padding: 1.3vmax 1vmax;
    background-color: rgba(0,0,0,0.2);
    &:hover{ background-color: rgba(255,255,255,0.1); }
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5);
`

const LeftCornerImage = styled(NoDragImage)`
    left: -0.2vmax;
    bottom: -0.2vmax;
`

const RightCornerImage = styled(NoDragImage)`
    right: -0.2vmax;
    top: -0.2vmax;
`

interface InventoryBoxProps {
    className?: string,
    children?: ReactNode,
    selected?: boolean,
    onClick?: () => void 
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

const InventoryBox = (props: InventoryBoxProps) =>
    <InventoryBoxContainer className={props.className} onClick={props.onClick} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        <LeftCornerImage
            src={props.selected ?
                "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/selected_left_corner.png" :
                "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/unselected_left_corner.png"
            }
            width={3} height={3}
            absolute
        />
        <RightCornerImage
            src={props.selected ?
                "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/selected_right_corner.png" :
                "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/unselected_right_corner.png"
            }
            width={3} height={3}
            absolute
        />
        {props.children}
    </InventoryBoxContainer>

export default InventoryBox
