import { useState, useEffect } from "react"

export default (inputArray: any, randomNumber: number) =>{
    const [ newArray, setNewArray ] =useState([])

    useEffect(()=>{
            getNewArray()
    },[randomNumber])

    const getNewArray =() =>{

        
        if(randomNumber < 2){  
            const lastIndex = inputArray.length   
            const missingElementsInArray = 2 - randomNumber 
            const lastElementsOfArray = inputArray.slice((lastIndex - missingElementsInArray), lastIndex)
            const firstElementsOfArray = inputArray.slice( 0, randomNumber + 5)
                
            setNewArray(lastElementsOfArray.concat(firstElementsOfArray))
        } else if (randomNumber > (inputArray.length -5)){
            const ElementsNeeded = 4 - ((inputArray.length - 1) - randomNumber )
            const firstElementsOfArray = inputArray.slice( 0, ElementsNeeded)
            const lastElementsOfArray = inputArray.slice(randomNumber -2, inputArray.length)
            
            setNewArray(lastElementsOfArray.concat(firstElementsOfArray))
        } else{
            setNewArray(inputArray.slice((randomNumber - 2),(randomNumber + 5)))
        }
    }  

    return [ newArray ]
}