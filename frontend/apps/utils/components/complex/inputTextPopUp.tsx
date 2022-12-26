import styled from "styled-components"
import { ButtonPopUp, TextOswald, InputText } from "../basic_components"
import { Formik, Form, ErrorMessage } from "formik"


const InputTextPopUpComponent = styled.div`
    width: 25vw;
    height: 12vw;
    background-color: #14212C;
    position: relative;

    @media only screen and (max-width: 414px) {
        width: 90vw;
        height: 50vw;
    }
`

const InputTextPopUpComponentOrnament = styled.div`
    width: inherit;
    height: inherit;
    background-color:  #14212C;
    border: 0.3vw solid #0B1015;
    border-radius: 0vw 5vw 0vw 0vw;

    @media only screen and (max-width: 414px) {
        border: 1vw solid #0B1015;
        border-radius: 0vw 20vw 0vw 0vw;
    }

`

const TextWrapper = styled.div`
    width: 100%;
    display: flex;
    margin-top: 1.5vw;

    @media only screen and (max-width: 414px) {
        margin-top: 8vw;
    }
`

const Center = styled.div`
    margin: auto;
`

const ButtonSection = styled.div`
    display: flex;
    margin-left: 9vw;

    @media only screen and (max-width: 414px) {
        margin-left: 35vw;
        margin-top: 3vw;
    }
`

const ButtonWrapper = styled.div`
    margin-top: 0.5vw;
    margin-right: 1vw;
    &:last-child{
        margin-right: 0vw;
    }
    @media only screen and (max-width: 414px) {
        margin-top: 0.5vw;
        margin-right: 3vw;
    }
`

const InputFieldPosition = styled.div`
   display: flex;
   height: 5vw;
   input{
    margin: auto;
   }

   @media only screen and (max-width: 414px) {
        height: 17.5vw;
    }

` 

const WarningText = styled.div`
    font-family: El Messiri;
    font-size: 0.8vw;
    color: white;
    display: flex;
    position: absolute;
    top: 7vw;
    left: 5vw;

    @media only screen and (max-width: 414px) {
        font-size: 2.5vw;
        top: 31vw;
        left: 15vw;
    }
`



const initialValues = {text: ""}

interface validatingValues {
    text: string
}

interface errorsValues {
    text?: string
}


const validatingValues = (values: validatingValues ) => {
    const errors : errorsValues = {};
    
    if(!values.text){
        errors.text = "*This field is required"
    }   

    if(values.text.length > 20){
        errors.text = "*Name has to be less than 20 characters"
    }

    return errors;
}

interface InputTextPopUp{
    title: string
    placeHolder: string
    action: (value: string) => void
    back: () => void
}

const InputTextPopUp = ({ title, action, back, placeHolder }:InputTextPopUp) : JSX.Element => {


    return(<>
        <InputTextPopUpComponent>
            <InputTextPopUpComponentOrnament>
                <TextWrapper>
                    <Center>
                        <TextOswald fontsize={1.2} color ="#47505F" fontsizeMobile = {6} lineHeightMobil = {7}>
                            {title}
                        </TextOswald>
                    </Center>
                </TextWrapper>

                <Formik
                    initialValues = {initialValues}
                    validate={validatingValues}
                    onSubmit = {(values) =>{
                        action(values.text)
                    }}
                >

                {({ submitForm }) => (
                    <Form>

                        <InputFieldPosition>
                            <InputText name="text" placeHolder={placeHolder}/>
                        </InputFieldPosition>

                        <WarningText>
                            <Center>
                                <ErrorMessage name="text" />
                            </Center>
                        </WarningText>
                        
                        <ButtonSection>

                            <ButtonWrapper>
                                <ButtonPopUp action={() => submitForm()}>Accept</ButtonPopUp>
                            </ButtonWrapper>

                            <ButtonWrapper>
                                <ButtonPopUp action ={() => back()}>cancel</ButtonPopUp>
                            </ButtonWrapper>

                        </ButtonSection>

                    </Form>
                )}
                </Formik>


              
            </InputTextPopUpComponentOrnament>
        </InputTextPopUpComponent>
    </>)
}

export default InputTextPopUp