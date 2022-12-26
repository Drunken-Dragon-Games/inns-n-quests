import { useEffect, useState } from "react"


//tiene tres input el status del quest si el aventurero murio y el tipo del aventurero el output es un string que completa el path para el renderizado de una imagen
export default (questStatus: "failed" | "succeeded" | null, isAdventureDead: boolean, type: string ) : string=>{
    
    const [emoji, setEmoji] = useState<string>("1")


    useEffect(() => {
        if(questStatus == "succeeded" ){
            setEmoji((Math.floor(Math.random() * 5) + 1).toString())
        } else if(questStatus == "failed"){

            if(isAdventureDead == true){
                
                // esta condicional regresa dependiendo del tipo de aventurero que tiene
                if(type == "gma"){
                    setEmoji("healing")
                } else if(type == "pixeltile"){
                    setEmoji("death")
                }
            }
            else{
                setEmoji((Math.floor(Math.random() * 4) + 7).toString())
            }
            
        }

        
    },[questStatus, isAdventureDead])



    return emoji
}