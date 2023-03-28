import { ReactNode } from "react"
import { Provider, useSelector } from "react-redux"
import styled from "styled-components"
import _ from "underscore"
import { DragNDropState, dragNDropStore } from "./drag-n-drop-state"

const DraggingItem = styled.div.attrs<{ position?: [number, number] }>( props => ({ 
    style: { 
        top: props.position ? props.position[1] : 0, 
        left: props.position ? props.position[0] : 0 
    }
}))<{ position?: [number, number] }>`
    position: absolute;
    z-index: 100;
    overflow: visible;
    display: ${props => props.position ? "block" : "none"};
    & > * {
        margin-left: -50%;
        margin-top: -50%;
        cursor: grabbing;
    }
`

const DraggingItemManager = ({ children }: { children?: ReactNode }) => {
    const draggingState = useSelector((state: DragNDropState) => state.draggingState, _.isEqual)
    return draggingState && !draggingState.hovering ?
        <DraggingItem position={draggingState?.position}>
            {children}
        </DraggingItem>
    : <></>
}

const DraggingItemGenerator = () => {
    const generator = useSelector((state: DragNDropState) => state.genDraggingItemView, _.isEqual)
    return (
        <DraggingItemManager>
            {generator()}
        </DraggingItemManager>
    )
}

const DragNDropView = () => 
    <Provider store={dragNDropStore}>
        <DraggingItemGenerator />
    </Provider>

export default DragNDropView