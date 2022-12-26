import { useRef } from "react"

//recibe el numero minimo y un numero maximo y el output un numero random entre el maximo y minimo
export default (min: number, max: number): number  => {
    const randomNumber = useRef<number>()

    randomNumber.current = (Math.random() * (max - min) ) + min;

    return  randomNumber.current

}

