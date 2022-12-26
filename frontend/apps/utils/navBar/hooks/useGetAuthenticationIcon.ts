import {useEffect, useState } from "react"
import { useLocalStorage } from "../../hooks"

export default (): string | null => {

    const {getLocalStorage} = useLocalStorage()
    const [ authenticationMethod, setAuthenticationMethod ] = useState<string | null>(null)

    useEffect(() => {
       const item = getLocalStorage("authenticationMethod")
       setAuthenticationMethod(item)
    }, [])

    return authenticationMethod
    
}