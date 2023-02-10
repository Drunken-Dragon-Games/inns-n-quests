import { useEffect, useState } from "react"
import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { DataAdventurerType } from "../../../../../types/idleQuest"
import { RequirementType, CharacterType } from "../../../../../types/idleQuest"

export default (adventurerList: string [], requirements: RequirementType ): number => {

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const allAdventurer = generalSelector.idleQuests.adventurers.data.data

    const [bonus, setBonus] = useState<number>(0)

    useEffect(() => {
        
        
        if(Object.keys(requirements).length > 0){
            if(requirements.all == true){
                allRequirement()
            } else if(requirements.party?.balanced == true){
                balanceRequirement()
            } else{
                characterValidation()
            }
        }
        
    },[adventurerList])

  

    const allRequirement = () => {
         
        
        //se llama a la funcion transforma una lista de ids de aventureros a una array con los aventurersos
        const adventurer = adventuresSelectedArray(adventurerList, allAdventurer)
        let isValidatedBool : boolean = false

        // esta condicional verifica que por lo menos haya un aventurero seleccionado
        if(adventurer.length > 0){
            //este reduce verifica si todos cumplen con la espesificaciones requeridas de razas y classes
            isValidatedBool = adventurer.reduce((acc: boolean, adventurer: DataAdventurerType ) => {
            
                if(requirements.character![0].race != undefined && requirements.character![0].race != adventurer.race){
                    return false
                } else if(requirements.character![0].class != undefined && requirements.character![0].class != adventurer.class){
                    return false
                }
                
                return acc
            }, true);
        } 

        setBonus(isValidatedBool == true ? 15 : -15)

    }

    const balanceRequirement = () => {
        //se llama a la funcion transforma una lista de ids de aventureros a una array con los aventurersos
        const adventurers = adventuresSelectedArray(adventurerList, allAdventurer)
        let isValidateArray : boolean [] = []
        
        //se crea un objeto Set le permite almacenar valores únicos de cualquier tipo
        let partyClasses = new Set();


        //validad que haya mas de un aventurero 
        if(adventurers.length > 0){
            
            //agrega todas las clases de los aventureros en el objeto set
            adventurers.forEach((adventurer: DataAdventurerType)=> {
                partyClasses.add(adventurer.class)
            })

            //si valida si el tamano del set es igual al tamano del array de ser verdad significa que todas las clases son diferentes
            if( partyClasses.size == adventurers.length ) {
                isValidateArray.push(true)
                                 
            } 

            //si hay requerimiento de character realiza las validaciones
            if(requirements.character != undefined){

                //validad y regresa boolean array
                const characterValidateBoolean : boolean [] = requirements.character!.map((requirement ) => {
                    const validation = singleRequirement(requirement, adventurers)
                    return validation
                })
                
                //filtra solo los true
                const filteredArray: boolean [] = characterValidateBoolean.filter( el => el == true)
                
                //copia el valor del array a la valiable isValidateArray
                isValidateArray = [...isValidateArray, ...filteredArray]   
                
                //calcula los bonos
                const bonus : number = bonusCalculation(1 + requirements.character.length, isValidateArray.length)

                setBonus(bonus)
            
            } else{
                 //calcula los bonos
                const bonus : number = bonusCalculation(1, isValidateArray.length)

                setBonus(bonus)

            }     
        }   
        
    }

    const characterValidation = () => {

          //se llama a la funcion transforma una lista de ids de aventureros a una array con los aventurersos
        const adventurers = adventuresSelectedArray(adventurerList, allAdventurer)
        
        //validad y regresa boolean array
        const characterValidateBoolean : boolean [] = requirements.character!.map((requirement) => {
            const validation = singleRequirement(requirement, adventurers)

            return validation
        })

         //filtra solo los true
        const filteredArray: boolean [] = characterValidateBoolean.filter( el => el == true)

         //calcula los bonos
        const bonus : number = bonusCalculation(requirements.character!.length, filteredArray.length)

        setBonus(bonus)
    }
    


    return bonus
}


//transforma una lista de ids de aventureros a una array con los aventurersos

const adventuresSelectedArray = (adventurerList: string [], allAdventurer: DataAdventurerType []) =>{

    const adventurersArray = adventurerList.reduce((acc:DataAdventurerType [] , adventurerId: string) => {
        
        
        const newAdventurer = allAdventurer.filter( (adventurer) => adventurer.adventurerId == adventurerId)

        return acc.concat(newAdventurer)
        
    }, []);

    return adventurersArray

}

const singleRequirement = (requirements:CharacterType, adventurerList:  DataAdventurerType []) =>{


  //se obtienen las propiedades del objeto del rquerimiento
  const requirementsKeys : string []= Object.keys(requirements)

  //este reducer comprueba que exista por lo menos un aventurero con las especificaciones requeridas
  const isValidatedBool : boolean = adventurerList.reduce((acc: boolean , adventurer ) => {
      
      const isTrue = requirementsKeys.reduce((acc: boolean [] , requirementKey: string) => {
          
          if(requirements[requirementKey as keyof CharacterType] == adventurer[requirementKey  as keyof DataAdventurerType]){

              return acc.concat(true)
              
          }
          return acc
      }, [])

      if(isTrue.length == requirementsKeys.length ){
          return true
      }
      
      return acc
  }, false);

  return isValidatedBool

}

const bonusCalculation = (totalNumber: number, currentNumber: number) =>{

    const bonus: number = ((currentNumber * 30 )/ totalNumber) - 15;

    return bonus
}
