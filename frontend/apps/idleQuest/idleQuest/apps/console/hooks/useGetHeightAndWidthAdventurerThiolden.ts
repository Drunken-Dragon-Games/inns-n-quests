import { useGetHeightAndWidth } from "./"
import { useState, useEffect } from "react"


export default (src: string,  type: string): number [] =>{
    
    const [ width, setWidth ] = useState<number>(0)
    const [ height, setHeight ]  = useState<number>(0)  
    
    useEffect(() => {
        if(type == "aot"){
            if(typeof src == "string"){
               const  advName = src.split('/')[5].split('-')[0]
               
               setWidth(getWidth(advName))
            }
        }
        
    },[src])


    useEffect(() =>{
        
        if(width > 0){
            const img = new Image();
            img.src = src;
            
            
            img.onload = function() {
                let widthImg = img.width 
                let heightImg = img.height  

                const calculatedHeight: number =  (heightImg * width) / widthImg
    
                setHeight(calculatedHeight)
            }
          
        }
        
     
    },[width])
   

    return [ height ,  width ]
}


const getWidth = (advName: string): number =>{

    let aotWidth: number = 0;

    if(advName == "drignir" || advName == "arne" || advName == "aztuneio" || advName == "vimtyr") {
        aotWidth = 5.5
    } else if (advName == 'ilinmyr') {
        aotWidth = 8.5
    } else if (advName == 'aragren' || advName == 'bodica' || advName == 'kilia' || advName == 'rando') {
        aotWidth = 4.3
    } else if (advName == 'vale' || advName == 'naya') {
        aotWidth = 5.7
    } else if (advName == 'mili') {
        aotWidth = 3.7
    } else if (advName == 'filgrald' || advName == 'gadrull' || advName == 'gulnim' || advName == 'rundir' || advName == 'thelas') {
        aotWidth = 4.6
    } else if (advName == 'volggan' || advName == 'marlanye' || advName == 'friga' || advName == 'astrid' || advName == 'tyr' || advName == 'ulf') {
        aotWidth = 3.5
    } else if (advName == 'mey' || advName == 'delthamar'  || advName == "ude'namvar" || advName == 'vadanna'|| advName == "avva_fire" ) {
        aotWidth = 4.1
    } else if (advName == 'milnim'  || advName == 'terrorhertz'  || advName == "arun'na" ) {
        aotWidth = 4.5
    } else if (advName == 'marendil') {
        aotWidth = 6.1
    } else if (advName == 'shaden' || advName == 'ferra') {
        aotWidth = 3.8
    } else if (advName == 'syonir' || advName == 'fjolnaer') {
        aotWidth = 6.2
    } else if (advName == 'lyskyr') {
        aotWidth = 5.4
    } else if (advName == 'perneli' || advName == 'eify') {
        aotWidth = 3.9
    } else if (advName == 'abbelka') {
        aotWidth = 5.7
    } else if (advName == 'aumara') {
        aotWidth = 4.4
    } else if (advName == 'mare' || advName == 'bo') {
        aotWidth = 5.1
    } else if (advName == 'dethiol') {
        aotWidth = 8.5
    } else if (advName == 'haakon') {
        aotWidth = 5
    } else if (advName == 'avva_ice') {
        aotWidth = 4.2
    } else if (advName == 'hilana') {
        aotWidth = 5.6
    } else if (advName == 'rei') {
        aotWidth = 4.8
    } else if (advName == 'othil') {
        aotWidth = 3.6
    } else if (advName == 'arin') {
        aotWidth = 5.3
    } else if (advName == 'aki') {
        aotWidth = 5.5
    } 

    return aotWidth
}