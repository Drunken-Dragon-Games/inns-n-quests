import { useState, useEffect } from "react";

export default (questDifficulty: number, questSlots: number, adventurersAverageLevel: number, requirementBonus: number) =>{

    const [succeedChance, setSucceedChance] = useState<number>(0)

    //un efecto que se activa cuando cambia cualquier valor 
    useEffect(()=>{
        if(adventurersAverageLevel > 0){
            succeedChanceFunction()
        }else{
            setSucceedChance(0)
        }
        
    },[questDifficulty, questSlots, adventurersAverageLevel, requirementBonus])

    

    //funcion para realizar el calculo para de la provabilidad de exito
    const succeedChanceFunction = () => {
    
        const chanceOfSuccess: number = (0.8 - (questDifficulty - adventurersAverageLevel)/10);  
        
        const chanceOfSuccessPercentage: number = (chanceOfSuccess *100) + requirementBonus
        

        if(chanceOfSuccessPercentage < 0){
            setSucceedChance(0)
        } else if(chanceOfSuccessPercentage > 100 && chanceOfSuccessPercentage > 0){
            setSucceedChance(100)
        } else if(chanceOfSuccessPercentage < 100){

            
            setSucceedChance(Math.round(chanceOfSuccessPercentage) )
        }
    }

    return [succeedChance]
}