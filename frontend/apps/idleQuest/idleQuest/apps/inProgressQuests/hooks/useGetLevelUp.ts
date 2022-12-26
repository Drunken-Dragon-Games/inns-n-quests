import { useState, useRef, useEffect } from "react"


//
export default (currentExperience: number, currentLevel: number, newExperience: number | null, speedTime: number): number [] => {
    const experience = useRef<number>(currentExperience)
    const [ experiencePercentage, setExperiencePercentage] = useState<number>(0)
    const [ newLevel, setNewLevel ] = useState<number>(currentLevel)
    const [speed, setSpeed] = useState<number>(1)


    //llega la nueva experiencia y activa el efecto
    useEffect(() => {
        if(newExperience != null){
            //setea la velociadad de la animacion
            setSpeedFunction()
        }
    }, [newExperience])

    //cuando llega la velocida se activa el efecto 
    useEffect(() => {
        if(newExperience != null){
            
            //input nueva experincia y nuevo nivel el output es el porcentaje de la barra de progreso
            const levelBar = getProgressPercentage(newExperience, newLevel )

            //saca la expericiencia antes de la nueva experiencia 
            const currentExperienceExpBar = getProgressPercentage(currentExperience, newLevel )

            //guarda la experiencia en una referencia
            experience.current = currentExperienceExpBar

            //detona la animacion de niveles
            levelUpAnimation(levelBar > 100 ? 100 : levelBar) 
        }

    }, [speed])

    useEffect(() => {
        if(newLevel > currentLevel && newExperience != null){
            //input nueva experincia y nuevo nivel el output es el porcentaje de la barra de progreso
            const levelBar = getProgressPercentage(newExperience, newLevel )

            //al haber subido de nivel la barra de experiencia es 0
            experience.current = 0
            
            //detona la animacion de niveles
            levelUpAnimation(levelBar > 100 ? 100 : levelBar)
        }
    }, [newLevel])
    

    //setea la velocidad en la que hara la animacion que depende del la cantidad nueva de experiencia que llega
    const setSpeedFunction = () =>{
        const differenceBetweenLevelUpAndCurrentLevel = (newExperience as number) - currentExperience

        const calculateSpeed = speedTime/differenceBetweenLevelUpAndCurrentLevel

        setSpeed(calculateSpeed)

    }
    const getExperienceRequired = (level: number) =>{
        let experience = 10*((level*(level+1)*(2*level+1)/6)+(10*(level*(level+1)/2)))
        return experience;
    }


    //
    const getProgressPercentage = (experience: number, level: number) => {
       
        //obtiene la experiencia sobrante del nivel actual
        const ExtraExperienceFromCurrentLevel = experience - getExperienceRequired(level-1)

        // obtiene lka diferencia entre el el nuevo nivel y lo que tiene sobrante
        const differenceBetweenCurrentLevelAndLevelUp: number = getExperienceRequired(level) - getExperienceRequired(level - 1)
    
        //saca por medio de una regla de 3 el porcentaje de progreso
        const levelBar: number = ( ExtraExperienceFromCurrentLevel / differenceBetweenCurrentLevelAndLevelUp )*100
        
        return levelBar
    }
    
    //funcion que anima la subidad de nivel recibe la expericencia nueva y anima la subida de nivel experincia 

    const levelUpAnimation = ( ExperienceForNextLevel: number) => {
        experience.current = experience.current + 1
        setExperiencePercentage(experience.current)

        const timmer = setTimeout(() => {
            levelUpAnimation(ExperienceForNextLevel)            
        }, speed);

        if(experience.current >=  100){
            clearTimeout(timmer)
            setNewLevel(newLevel + 1)
        }

        if(experience.current  >=  ExperienceForNextLevel ){
            clearTimeout(timmer)
        }

    }


    return [newLevel , experiencePercentage]
}