import { useErrorHandler } from "../../hooks"
import styled from "styled-components"

import { Snackbar } from "../basic_component" 

const SnackbarContainer = styled.div`
    position: fixed;
    bottom: 0vw;
    left: 90%;
    z-index: 50;
    width: 0vw;
`


const ErrorHandler = ()=>{
    
    const [errorsArray] = useErrorHandler()
    
    return (<>
    
        <SnackbarContainer>
        {errorsArray.map((elOriginal, index) => {

            return   <Snackbar status ={elOriginal.status} key={index}>{elOriginal.message}</Snackbar>
        })}
        </SnackbarContainer>
    </>)
}

export default ErrorHandler