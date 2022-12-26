import { useEffect, useState } from "react";

//obtiene una imagen y el width original de la imagen que se quiere renderizar salca el height necesario para renderizar esa imagen
export default (src: string, widthOriginal: number): number => {

    const [height, setHeight] = useState<number>(0)
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = function() {
            let width = img.width 
            let height = img.height  

            const calculatedHeight =  (height * widthOriginal) / width
            setHeight(calculatedHeight)
        }
        
    }, [src])
    
    return height
}