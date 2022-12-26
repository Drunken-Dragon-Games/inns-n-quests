import { useEffect, useState } from "react"

//Input una string y su output es un boolean
export default (questSuccessful: "failed" | "succeeded" | "in_progress" | null, claimStatus: string) : boolean=>{

    const [claimShadow, setClaimShadow ] =useState<boolean>(false)

    useEffect(() => {
        if(questSuccessful == "succeeded"){
            setClaimShadow(true)
        }
    }, [questSuccessful])

    useEffect(() => {
        if(claimStatus == "succeded"){
            setClaimShadow(false)
        }
    }, [claimStatus])
    

    return claimShadow
}