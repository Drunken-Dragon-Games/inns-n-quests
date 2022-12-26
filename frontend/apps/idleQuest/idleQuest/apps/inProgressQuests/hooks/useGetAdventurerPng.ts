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

interface Sprites {
    scr: string
    type: boolean
}


// recibe un array de aventureros y un id, el output es un objeto con el sprite del aventurero y su typo
export default ()  => {

    const pngAdvernturer = (id: string, adventurers: DataAdventurer[]) =>{
        
        const reducer = adventurers.reduce ((acc: any [] , originalElement: any) =>{
            
            
            if(id == originalElement.id){
                return acc.concat({ src: originalElement.sprites, type: originalElement.type})
            }

            return acc
            
        }, [])
        
        return reducer[0]

    }
    
    
    return [pngAdvernturer]
}
