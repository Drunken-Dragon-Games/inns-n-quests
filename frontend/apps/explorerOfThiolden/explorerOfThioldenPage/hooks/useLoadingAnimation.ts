import { useState, useEffect } from "react"

export default (speed: number): number =>{

    const [ numberToRender, setNumberToRender ] = useState<number>(1)

    useEffect(() => {
        setTimeout(function(){
            setNewNumber()
        }, speed);
    }, [numberToRender])

    const setNewNumber = () => {
        if(numberToRender >= 5){
            setNumberToRender(1)
        } else if (numberToRender < 5){
            setNumberToRender(numberToRender + 1)
        }
    }
    
    return numberToRender
}