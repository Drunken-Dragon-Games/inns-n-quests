import styled from "styled-components"
import { useField } from "formik"
import { TextElMessiri } from "./"


interface Card {
    selected: boolean
}

const Card = styled.div<Card>`
    background-color: ${props => props.selected ? "#FFFFFF" : "#C58E31"};
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s;
    padding: 0.15vw 0.7vw 0.1vw 0.7vw; 
    margin: 0.083vw 0vw;
    &:hover{
        background-color: #FFFFFF;
    }
`

const RadioButtonHide = styled.input.attrs( props => ({...props}) )`
    position: absolute;
    visibility: hidden;
`


const  RadioButtonLabel = styled.label`
    display:block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    -ms-transform: translateY(16%);
    transform: translateY(16%);
`

interface SelectOptionCard{
    children: string
    textAlign?: "center" | "right" | "left"
    name: string
    onChange?: any
    value: string
    selected: boolean
}

const SelectOptionCard = ({children, textAlign,  name, onChange, value, selected}: SelectOptionCard) =>{

    const [field, meta] = useField({ name, onChange, value,  type: "radio" });
    let realName = ""

    if(children == "Adventurer of the East"){
        realName ="Adv of the East"
    } else if(children == "Adventurer of the Drunken Dragon"){
        realName = "Drunken Dragon"
    }
    else{
        realName = children
    }
 
    return <>
       
        <Card selected = {selected}>
                <RadioButtonLabel>
                    <RadioButtonHide {...field} name={name} onChange={onChange} type="radio" id={children} value={value}/>
                    <TextElMessiri 
                        fontsize= {0.818} 
                        color= "#0B0E11" 
                        textAlign={textAlign}
                    >{realName}</TextElMessiri>
                </RadioButtonLabel>
        </Card>
    </>
}

export default SelectOptionCard