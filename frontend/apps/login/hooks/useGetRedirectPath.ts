import { useEffect, useState } from "react"
import { useLocalStorage } from "../../utils/hooks"

export default (): string => {

    const [ path, setPath ] = useState<string>("/")

    const { getLocalStorage, deleteLocalStorage } = useLocalStorage()

    useEffect(()=>{
        const item = getLocalStorage("redirect")
        deleteLocalStorage("redirect")
        if(item != null){
            
            setPath(item)
        }       
    },[])

    return path
}