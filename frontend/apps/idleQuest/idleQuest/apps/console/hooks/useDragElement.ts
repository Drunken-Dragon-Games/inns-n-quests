import { useDrag } from "react-dnd";
import { DataAdventurerType } from "../../../../../../types/idleQuest";

export default (data: DataAdventurerType) => {

    const previewOptions = {
        offsetX: 40,
        offsetY: 60,
    }

    //este elemento hace drageable todo la tarjeta
    const [{isDragging}, drag, preview] = useDrag(()=>({
        type: "adventurer",
        item:{ id: data.adventurerId, src: data.sprites, experience: data.experience, type: data.type}, 
        previewOptions,
        collect:(monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))
    
    const img = new Image()

    img.src = data.sprites

    //con esto cambia a un preview personalizado
    preview(img, previewOptions)

    return drag
}