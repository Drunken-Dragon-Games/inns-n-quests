import { useState, useEffect} from "react"
import { useInterval } from "../../../utils/hooks" 

//funcion INPUT numero de milisegundos que es Data.now mas el tiempo del cooldown y regresa el tiempo en dias si es mas de 24 horas 
//menos de 24 horas en horas y menos de una hora regresa <1 hr

export default (cooldown: number) => {

    const [coolDownTimeLeft, setCoolDownTimeLeft] = useState<string>("")
    const [ timeLeftNumber, setTimeLeftNumber ] = useState<number>(0)

    //useInterval llama a la funcion que le das cada 3 segundos
    useInterval(async ()=> timeLeft() , 3000)

   
    const timeLeft = () =>{
        
        //se saca los milisendos de Date.now
        const now = Date.now()

        //timeleft saca el tiempo que queda de cooldown en horas
        let timeLeft = (cooldown - now) / 3600000        
        
        console.log(timeLeft);
        
        //realiza una comparacion para ver que regresar 
        if(timeLeft > 24){
            const timeDaysDecimals = timeLeft/24
            const timeDays = Math.ceil(timeDaysDecimals) 
            setTimeLeftNumber(timeDays)
            setCoolDownTimeLeft(`${timeDays} days`)
        } else if(timeLeft < 24 && timeLeft > 1){
            const timeHrs = Math.ceil(timeLeft)
            setTimeLeftNumber(timeHrs)
            setCoolDownTimeLeft(`${timeHrs} hrs`)
        } else if (timeLeft < 1 && timeLeft > 0 ){
            setCoolDownTimeLeft( "<1 hr")
            setTimeLeftNumber(timeLeft)
        } else if (timeLeft < 0){
            setTimeLeftNumber(0)
        }

        console.log(coolDownTimeLeft);
        
    }

    useEffect(()=>{
        timeLeft()
    },[cooldown])

   
    return {coolDownTimeLeft, timeLeftNumber}
}

