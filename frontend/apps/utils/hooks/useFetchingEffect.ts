import {useEffect, useRef } from "react"

export default (action : () => void) => {

    const isMounted = useRef<boolean>(false)

    useEffect(()=>{
        if(isMounted.current == true){
            
            action()
        } else{
            isMounted.current =true
        }

    },[])

}