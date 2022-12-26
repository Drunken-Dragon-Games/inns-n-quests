import { useState, useEffect} from "react"
import {
    useWindowWidth,
  } from '@react-hook/window-size'

export default (): boolean =>{
    const [ isMobile, setIsMobile ] =useState<boolean>(false)


    const onlyWidth = useWindowWidth()
  
    
  
    useEffect(() => {
      if(onlyWidth < 415){
        setIsMobile(true)
      } else if(onlyWidth >= 415){
        setIsMobile(false)
      } 
    }, [onlyWidth])

    return isMobile
}