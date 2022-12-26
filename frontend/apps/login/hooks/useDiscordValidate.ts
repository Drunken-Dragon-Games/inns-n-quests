import { useEffect } from "react";
import { compareNonce } from "../features/discordConnect";
import { useLoginDispatch } from "../features/hooks";
import { useRouter } from 'next/router'
import { useLoginSelector } from "../features/hooks";
import { selectLoginPageReducer } from "../features/appLogin";
import { useRedirect, useTimeOut } from "../../utils/hooks";
import { setIsAuthenticated } from "../features/authentication";
import { useGetRedirectPath } from "./"


export default () => {

    const LoginDispatch = useLoginDispatch()

    const loginSelector = useLoginSelector(selectLoginPageReducer)
     
    const authenticated =  loginSelector.authentication.authenticated.isAuthenticated

    const router = useRouter()
    
    const [ redirectPath, redirectUrl ] = useRedirect()

    const path = useGetRedirectPath()

    

    useEffect(() => {
        
        if(router.query.state !== undefined && router.query.code !== undefined){
            LoginDispatch(compareNonce((router.query.state as string), (router.query.code as string)))
        } else {
            LoginDispatch(setIsAuthenticated("rejected"))
        }
        
    }, [router])
    
    useEffect(() => {

        if ( authenticated === "authenticated") {

            
            useTimeOut(() => redirectPath(path), 1000)
            
            
        } else if (authenticated === "rejected") {
            
            useTimeOut(() => redirectPath("/login"), 1000)  
        }

        return () => {
            LoginDispatch(setIsAuthenticated("idle"))
        } 

    }, [authenticated])
}