import { DataAdventurerType } from "../../../../../../types/idleQuest"


// recibe un array de aventureros y un id, el output es un objeto con el sprite del aventurero y su typo
export default ()  => {

    const pngAdvernturer = (id: string, adventurers: DataAdventurerType[]) =>{
        
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
