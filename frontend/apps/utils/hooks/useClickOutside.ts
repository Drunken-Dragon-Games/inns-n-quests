import { useEffect } from "react";


//input una referencia del componente que quiere que cuando se clicke fuera de el se active un funcions
const useClickOutside = (ref: any, action: () => void ) => {

  useEffect(() => {
  
    //funcion que se activa una vex que se clickea afuera
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
          action()
      }
    }
    // Se agrega eventListener para detectar cuando el mouse clickeo fuera de un elemento
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Se limpia el eventListener 
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);


};

export default useClickOutside;
