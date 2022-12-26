import { Loading, FullScreen} from "../basic_components"
import { useState, useEffect } from "react";
import { ConditionalRender } from "../../../../utils/components/basic_components";


const LoadingSection = (): JSX.Element =>{

    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(function(){
          setIsLoading(false)
        }, 3000);
      }, [])


    return(<>
        <ConditionalRender condition={isLoading == true}>
            <FullScreen>
                <Loading size ={10}/>
            </FullScreen>
        </ConditionalRender>
    </>)
}

export default LoadingSection