import { useState, useEffect } from "react"

export default (min: number, inputArray: any): number =>{
    

    const [ randomNumber, setRandomNumber] = useState<number>(0)
    

    useEffect(()=>{
        const max = inputArray.length - 1
        const number = Math.floor((Math.random() * max) + min);
        setRandomNumber(number)
    },[min, inputArray] )

    return randomNumber
}