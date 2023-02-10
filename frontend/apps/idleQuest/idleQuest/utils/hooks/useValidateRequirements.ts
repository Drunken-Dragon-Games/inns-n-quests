import { useState, useEffect } from "react"
import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { DataAdventurerType } from "../../../../../types/idleQuest"
import { RequirementType, CharacterType } from "../../../../../types/idleQuest"



export default (adventurerList: string [], requirements: RequirementType  ) => {


    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const allAdventurer = generalSelector.idleQuests.adventurers.data.data

    const [isValidate, setIsValidate ] = useState<boolean>(false)

    useEffect(()=>{
      if(requirements.all !== undefined){
            allRequirement()
      } else if (requirements.party != undefined && requirements.party.balanced){
            balanceRequirement()
      } else{
            singleRequirement()
      }
    },[adventurerList])


    //transforma una lista de ids de aventureros a una array con los aventurersos
    const adventuresSelectedArray = (adventurerList: string [], allAdventurer: DataAdventurerType []) =>{

        const adventurersArray = adventurerList.reduce((acc:DataAdventurerType [] , adventurerId: string) => {
            
            
            const newAdventurer = allAdventurer.filter( (adventurer) => adventurer.adventurerId == adventurerId)

            return acc.concat(newAdventurer)
            
        }, []);

        return adventurersArray

    }

    //esta funcion valida si todos complen con la caracteristica dada en character
    const allRequirement = () => {
         
        
        //se llama a la funcion transforma una lista de ids de aventureros a una array con los aventurersos
        const adventurer = adventuresSelectedArray(adventurerList, allAdventurer)
        let isValidatedBool : boolean = false

        // esta condicional verifica que por lo menos haya un aventurero seleccionado
        if(adventurer.length > 0){
            //este reduce verifica si todos cumplen con la espesificaciones requeridas de razas y classes
            isValidatedBool = adventurer.reduce((acc: boolean, adventurer ) => {
            
                if(requirements.character![0].race != undefined && requirements.character![0].race != adventurer.race){
                    return false
                } else if(requirements.character![0].class != undefined && requirements.character![0].class != adventurer.class){
                    return false
                }
                
                return acc
            }, true);
        } 

        setIsValidate(isValidatedBool)
        
    }
    

    //esta funcion se llama cuando se tiene que validar un solo rquerimiento
    const singleRequirement = () =>{

          //se llama a la funcion transforma una lista de ids de aventureros a una array con los aventurersos
        const adventurer = adventuresSelectedArray(adventurerList, allAdventurer)

        //se obtienen las propiedades del objeto del rquerimiento
        const requirementsKeys : string []= Object.keys(requirements.character![0])

        //este reducer comprueba que exista por lo menos un aventurero con las especificaciones requeridas
        const isValidatedBool = adventurer.reduce((acc: boolean , adventurer ) => {
            
            const isTrue = requirementsKeys.reduce((acc: boolean [] , requirementKey: string) => {
                
                if(requirements.character![0][requirementKey as keyof CharacterType] == adventurer[requirementKey  as keyof DataAdventurerType]){

                    return acc.concat(true)
                    
                }
                return acc
            }, [])

            if(isTrue.length == requirementsKeys.length ){
                return true
            }
            
            return acc
        }, false);

        setIsValidate(isValidatedBool)

    }

    //esta funcion se llama cuando se tiene que validar un requerimiento balance
    const balanceRequirement = () => {
        //se llama a la funcion transforma una lista de ids de aventureros a una array con los aventurersos
        const adventurers = adventuresSelectedArray(adventurerList, allAdventurer)

        //se crea un objeto Set le permite almacenar valores únicos de cualquier tipo
        let partyClasses = new Set();

        let isValidate: boolean = false

        //validad que haya mas de un aventurero 
        if(adventurers.length > 0){
            
            //agrega todas las clases de los aventureros en el objeto set
            adventurers.forEach((adventurer)=> {
                partyClasses.add(adventurer.class)
            })

            //si valida si el tamano del set es igual al tamano del array de ser verdad significa que todas las clases son diferentes

            
            isValidate = partyClasses.size == adventurers.length
        }   
        setIsValidate(isValidate)
    }
    
    return [isValidate]
}