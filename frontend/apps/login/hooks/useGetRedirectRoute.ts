import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {  useLocalStorage } from "../../utils/hooks"

export default (): string => {

    const router = useRouter()
    const [route, setRoute] = useState<string>("/")
    const { setLocalStorage, deleteLocalStorage } = useLocalStorage()

    useEffect(()=>{
        if( typeof router.query.redirect == "string"){
            setLocalStorage("redirect", router.query.redirect )
            setRoute(router.query.redirect)
        }
    },[router])

    
    useEffect(()=>{
        deleteLocalStorage("redirect")
    },[])

    return route
}