import { useState, useEffect } from "react"

//recibe tres entrada uno es el tiempo completo en dias segundo el tiempo que regresenta cada punto y el tamano del width en vw
// el output es la distancia entre los puntos, el numero de puntos y por ultimo es un array que representa el numero de puntos para poder mapear
export default (time: number | string, representativeTime: number, lineLong: number) => {

    const [distanceBetweenPunts, setDistanceBetweenPunts] = useState<number>(0)
    const [numberOfPunts, setNumberOfPunts] =useState<number>(1) 
    const [slots, setSlots] = useState<string []>([])

    //cuando llega el tiempo en dias se activa el efecto y obtiene el numero de puntos
    
    useEffect(() => {
        if(typeof(time) != "string"){
            setNumberOfPunts(Math.ceil(time/ representativeTime))
        }
    }, [time])
    
    //una vez calculado el numero de puntos obtiene el array y la distancia entre putnos 
    useEffect(() => {
        
        setSlots(Array(numberOfPunts).fill(''))
        setDistanceBetweenPunts( lineLong / numberOfPunts )
        
    }, [numberOfPunts])

    return [ distanceBetweenPunts, numberOfPunts, slots ]

}