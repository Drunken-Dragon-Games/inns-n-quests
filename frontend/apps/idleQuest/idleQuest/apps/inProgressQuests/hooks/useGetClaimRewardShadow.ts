import { useEffect, useState } from "react"

export default (questSuccessful: "in-progress" | "finished" | "claimed") : boolean=>{

    /*
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
    */
   return true
}