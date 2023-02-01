import useRedirect from './useRedirect'
import { useEffect } from 'react'

export default (condition: boolean, path: string) => {
    
    const [ redirectPath, redirectUrl ] = useRedirect()

    useEffect(()=>{
        if(condition){
            redirectPath(path)
        }
    },[condition])

}