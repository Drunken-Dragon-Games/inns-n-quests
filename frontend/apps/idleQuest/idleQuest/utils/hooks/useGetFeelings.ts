import { useState, useEffect } from "react"

//esta funcion obtine un current Level y un quest Level y regresa un numero que sera interpretado como una emocion
export default (currentLevel: number, questLevel: number): number => {

    const [feelings, setFeelings] = useState<number>(0)


    useEffect(() => {
        setFeelingNumber(currentLevel, questLevel)
    }, [currentLevel])
    

    const setFeelingNumber = (currentLevel: number, questLevel: number) => {
        const feelingsNumber: number = 0.8 - ((questLevel -currentLevel)/10)

        setFeelings(feelingsNumber)
    }

    return feelings

}
