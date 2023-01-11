import { useEffect, useState } from "react"

//Input una string y su output es un boolean
export default (questSuccessful: "failed" | "succeeded" | "in_progress" | null, claimStatus: string) : boolean=>{

    const [claimShadow, setClaimShadow ] =useState<boolean>(false)

    console.log(questSuccessful)

    useEffect(() => {
        if(questSuccessful === "succeeded"){
            setClaimShadow(true)
        } else{
            setClaimShadow(false)
        }
    }, [questSuccessful])

    useEffect(() => {

        if(claimStatus == "fulfilled"){
            setClaimShadow(false)
        }
    }, [claimStatus])
    

    return claimShadow
}