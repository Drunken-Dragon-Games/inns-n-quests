import { useState, useEffect, useRef } from "react"

//una funcion que creea un effecto de sumado el input es un numero maximo un valor inicial y la velociadad y el output es un numero que cada segundo cambia dando un efecto de contador
const useEffectCounting = ( max: number, initialValue: number, speed: number): number => {

    const count = useRef<number>(0)
    const isMount = useRef<boolean>(false)
    const [dragonSilver, setDragonSilver] = useState<number>(initialValue)

    useEffect(() => {
        
        //esto detecta si el componente ya esta montado o no 
        if(initialValue !== null){
            if(isMount.current === true){
                counter()
            }else{
                isMount.current = true
                count.current = initialValue
                setDragonSilver(initialValue)
            }
        }

    }, [initialValue])

    // esta funcion adiere un al + 1 al contador y la funcion se vulve a llamar asi misma una vez que supera el maximo se elimina el timeout y setea el numero mas alto
    const counter = () => {
        count.current = count.current + 1
        setDragonSilver(count.current)
    
        const timmer = setTimeout(() => {
            counter()            
        }, speed);

        if(count.current  >=  max){
            clearTimeout(timmer)
            setDragonSilver(max)
        }
    }


    return dragonSilver
}

export default useEffectCounting