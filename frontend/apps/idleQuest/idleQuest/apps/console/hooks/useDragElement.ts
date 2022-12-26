import { useDrag } from "react-dnd";


interface DataAdventurer{
    id: string
    name: string,
    experience: number
    adventurer_img: string
    in_quest: boolean
    on_chain_ref: string
    onRecruitment?: boolean
    sprites: string
    type: "pixeltile" | "gma"
    metadata: metadata
    race: string
    class: string
}

interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
}

export default (data: DataAdventurer) => {

    const previewOptions = {
        offsetX: 40,
        offsetY: 60,
    }

    //este elemento hace drageable todo la tarjeta
    const [{isDragging}, drag, preview] = useDrag(()=>({
        type: "adventurer",
        item:{ id: data.id, src: data.sprites, experience: data.experience, type: data.type}, 
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