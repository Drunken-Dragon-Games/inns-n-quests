import { useEffect, useRef } from "react"

export default (callback: any ,delay: number) =>{
    const savedCallback = useRef<any>();


    //recuerda el ultimo callback
    useEffect(()=>{
        savedCallback.current = callback
    },[callback])

    //el set up del intervalo

    useEffect(()=>{
        
        const tick =() =>{
            savedCallback.current();
        }
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    },[callback, delay])

}