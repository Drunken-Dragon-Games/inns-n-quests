import { useState, useEffect } from "react"

export default (scrolling: any, length: number): boolean =>{

    const [renderArrows, setRenderArrows] = useState<boolean>(false)


       //este efecto agrega las fechas al scroll cuando cuando se necesita el scroll
    useEffect(() => {
      
        if(scrolling.current !== null ){

          if(scrolling.current.children[0] !== undefined){
            if((scrolling.current.children[0].clientHeight * length) >  scrolling.current.clientHeight){
              setRenderArrows(true)
            }
          }
        }
    })

    return renderArrows
}