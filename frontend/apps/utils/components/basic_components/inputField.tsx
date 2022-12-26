import styled from "styled-components"
import { useField } from "formik"

const InputFieldComponent = styled.input`
    border: none;
    background-color: #0B1015;
    width: 20vw;
    height: 2vw;
    font-family: El Messiri;
    font-size: 0.8vw;
    padding: 0vw 1vw;
    color: white;

    @media only screen and (max-width: 414px) {
        width: 70vw;
        height: 7vw;
        font-size: 4vw;
        padding: 0vw 3vw;
    }
`

interface InputField{
    name: string
    placeHolder: string
}

const InputField = ({name, placeHolder}:InputField) : JSX.Element => {

    const [field, meta] = useField({ name,  type: "text" });
    return(<>
        <InputFieldComponent {...field} name = {name} placeholder = {placeHolder}/>
    </>)
}

export default InputField