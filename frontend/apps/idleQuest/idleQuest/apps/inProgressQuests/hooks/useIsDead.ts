import { useState, useEffect } from "react"

//recibe el id de un aventurero y una lista de ids de los aventureros muertos el output un boolean si esta vivo o muertos
export default ( adventurerId: string, deathList: string [] | null): boolean => {

    const [isDead, setIsDead] = useState<boolean>(false)


    useEffect(() => {
            isAdventureDead();
    },[deathList])

    

    const isAdventureDead = ()  =>{
        if(deathList != null){
            const isDeath = deathList.reduce ((acc: boolean [], originalElement: any) =>{

                if(originalElement.id == adventurerId){
                        return [true]
                }
            
                    return acc
            
            }, [])
        
            setIsDead(isDeath[0])
        }
    }

    

    return isDead
}
