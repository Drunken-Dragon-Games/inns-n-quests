//esta funcion recibe el tiempo unicial la duracion y un booleano es para para saber si se muestra 
export default (startTime: Date , duration: number, displayed?: boolean) =>{
// FIXME: dont know the input 

    //transforma un string a formato date 
    const initialDate = new Date(startTime)

    const startingDate = new Date(startTime)

    
    // console.log(initialDate)


    //obtiene en milisegundos el tiempo total
    initialDate.setMilliseconds(initialDate.getMilliseconds() + duration)

    const date = new Date()
    
    //obtiene el tiempo restante en dias
    let timeLeft = ((initialDate.getTime() - date.getTime())/3600000)/24

    //obtiene la duracion competa en dias 
    let completeDuration = ((initialDate.getTime() - startingDate.getTime()) /3600000)/24
    
    // console.log(completeDuration);
    

    //condicional lanza un string
    if(timeLeft < 1 && timeLeft > 0 && displayed){

        timeLeft = Math.ceil(Number(timeLeft) * 24) 
        
        if(timeLeft > 1 ){

            return [`${timeLeft} hrs`]
        }
        
        return ["< 1hr"]
        
    } 

    else if(timeLeft <= 0 && displayed){
        return ["0 hrs"]
    } 
    
    //redondea al arriba
    timeLeft = Math.ceil(timeLeft) 
    completeDuration = Math.ceil(completeDuration) 
    

    return [`${timeLeft} days`, completeDuration ]
}