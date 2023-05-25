import styled from "styled-components"
import { isCharacter, isFurniture } from "../../../../../common"
import { DragNDropApi } from "../../../drag-n-drop"
import { OverworldApi } from "../../../overworld"

const OverworldDropboxArea = styled.div`
    width: 100%;
    height: 100%;
`


/*
    const hovering = overworldDropBox.hoveringPayload
    const dropped = overworldDropBox.droppedPayload
    if ((isCharacter(dropped) || isFurniture(dropped)) && !dragging)
        OverworldApi.draggingItemIntoOverworld(dropped)
    else if ((isCharacter(hovering) || isFurniture(hovering)) && dragging)
        OverworldApi.draggingItemIntoOverworld(hovering, dragging.position)
    else if (!hovering && !dropped)
        OverworldApi.cancelDraggingItemIntoOverworld()
*/
const OverworldDropbox = () => {
    const { ref } = DragNDropApi.useDropbox({
        utility: "overworld-drop",
        onHoveringMove: (dropbox, position) =>
            (isCharacter(dropbox.hoveringPayload) || isFurniture(dropbox.hoveringPayload)) && 
                OverworldApi.draggingItemIntoOverworld(dropbox.hoveringPayload, position),
        onHoveringLeave: () => 
            OverworldApi.cancelDraggingItemIntoOverworld(),
        onDropped: (dropbox) => 
            (isCharacter(dropbox.droppedPayload) || isFurniture(dropbox.droppedPayload)) && 
                OverworldApi.draggingItemIntoOverworld(dropbox.droppedPayload),
    })

    return <OverworldDropboxArea ref={ref} />
}


export default OverworldDropbox
