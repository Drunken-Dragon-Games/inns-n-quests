import { useRef } from "react"

// esta funcion tiene un input del tiempo que queda y la duracion completa y regresa la cantidad de marcas que representan el tiempo completo
export default (timeLeft: number, completeDuration: number, representativeTime: number)  => {
      
    //se saca el tiempo que queda como unidad en dos dias 
    let timeMarks = Math.floor((completeDuration - timeLeft)/representativeTime)
    

    // si la duracion es menor a dos dias se redondea hacia arriba
    if(completeDuration < representativeTime){
        timeMarks = Math.ceil((completeDuration - timeLeft)/representativeTime)
    }

    return [ timeMarks ]
}

