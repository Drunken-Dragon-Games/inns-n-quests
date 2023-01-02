import { useLocalStorage, useRedirect } from "../../utils/hooks"
import { useEffect } from "react"
import { useLoginSelector } from "../features/hooks"
import { selectLoginPageReducer } from "../features/appLogin"
import { useLoginDispatch } from "../features/hooks"
import { setIsAuthenticated } from "../features/authentication"

export default (route: string) => {
    
    const LoginDispatch = useLoginDispatch()

    const { deleteLocalStorage } = useLocalStorage()

    const loginSelector = useLoginSelector(selectLoginPageReducer)
    const authenticated =  loginSelector.authentication.authenticated.isAuthenticated
    const [ redirectPath, redirectUrl ] = useRedirect()

    useEffect(()=>{

        if(authenticated == "authenticated"){
            deleteLocalStorage("redirect")
            redirectPath(route)
        }

        return () => {
            LoginDispatch(setIsAuthenticated('idle'))
        }

    },[authenticated])
        
}