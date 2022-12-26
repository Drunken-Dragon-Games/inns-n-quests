import { useRedirect } from "../../../utils/hooks"
import { useEffect, useRef } from "react"
import { useGeneralSelector } from "../../../../features/hooks"
import { selectGeneralReducer } from "../../../../features/generalReducer"

export default (isAccountData: ("fulfilled" | "pending" | "rejected" | "idle")) =>{
    
    const [redirectPath, redirectUrl] = useRedirect()
    const isMounted = useRef<boolean>(false)

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const refreshStatus = generalSelector.refresh.status.status



    useEffect(() => {        
        
        const refreshToken = localStorage.getItem("refresh");

        if((isAccountData == "rejected" && isMounted.current == true && typeof refreshToken != "string") || 
        (refreshStatus == "rejected" &&  isAccountData == "rejected" && isMounted.current == true )){
            redirectPath("/login")
        } else{
            isMounted.current = true
        }
    }, [isAccountData, isMounted])
    
}