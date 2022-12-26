import { useLocalStorage, useRedirect } from "../../utils/hooks"
import { useEffect } from "react"
import { useLoginSelector } from "../features/hooks"
import { selectLoginPageReducer } from "../features/appLogin"


export default (route: string) => {
    
    const { deleteLocalStorage } = useLocalStorage()

    const loginSelector = useLoginSelector(selectLoginPageReducer)
    const authenticated =  loginSelector.authentication.authenticated.isAuthenticated
    const [ redirectPath, redirectUrl ] = useRedirect()

    useEffect(()=>{

        if(authenticated == "authenticated"){
            deleteLocalStorage("redirect")
            redirectPath(route)
        }

    },[authenticated])
        
}