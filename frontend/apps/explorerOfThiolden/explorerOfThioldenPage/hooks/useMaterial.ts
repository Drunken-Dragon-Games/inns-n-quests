import { useState, useEffect } from "react"

export default (aps: number): string => {

    const [material, setMaterial] = useState<string>("")


    useEffect(()=>{
        if(aps <= 9){
            setMaterial("bronze")
        } else if(aps <= 19){
            setMaterial("silver")
        } else if(aps <= 24){
            setMaterial("gold")
        } else if(aps <= 29){
            setMaterial("diamond")
        } else if(aps == 30){
            setMaterial("myrthrill")
        } else if(aps == 32){
            setMaterial("drunkendragon")
        }
    },[aps])


    return material
}