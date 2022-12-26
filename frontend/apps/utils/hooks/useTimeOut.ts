export default (action: () => void, time: number) =>{
    
    const closePaper = setTimeout(function(){
            action()
    }, time);

}