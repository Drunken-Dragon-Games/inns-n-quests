import { useState, useEffect } from "react"

export default (adventurer_image: string): boolean | null =>{

    const[isChroma, setIsChroma] = useState<boolean | null>(null)

    useEffect(()=>{
        const Chroma = adventurer_image.split("_")

        if(Chroma[2] == "1"){
            setIsChroma(true)
        }

        if(Chroma[2] == "0"){
            setIsChroma(false)
        }
        
    },[adventurer_image])
    return isChroma
}