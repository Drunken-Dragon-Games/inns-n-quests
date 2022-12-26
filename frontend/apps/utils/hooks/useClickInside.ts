import { useEffect } from "react";


//input una referencia del componente que quiere que cuando se clicke fuera de el se active un funcions
const useClickInside = (clickAbleElement: any, action: () => void, insideElement?: any ) => {

  useEffect(() => {
  
    //funcion que se activa una vex que se clickea dentro
    function handleClickOutside(event: any) {

        if(insideElement != undefined){
            if (clickAbleElement.current && clickAbleElement.current.contains(event.target) && insideElement.current && !insideElement.current.contains(event.target)) {
                action()
          }
        } else{
            if (clickAbleElement.current && clickAbleElement.current.contains(event.target)) {
                action()
          }
        }
    
    }
    // Se agrega eventListener para detectar cuando el mouse clickeo fuera de un elemento
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Se limpia el eventListener 
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickAbleElement, insideElement]);

};

export default useClickInside;
