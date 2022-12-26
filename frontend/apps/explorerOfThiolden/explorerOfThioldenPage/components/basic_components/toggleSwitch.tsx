import styled from "styled-components"
import TextElMessiri from "./textElMessiri"
import { useField } from "formik"

const SwitchPadding = styled.div`
    padding: 0 1.208vw;
    position: relative;
    top: -0.725vw;
    flex: 50%;
    margin-bottom: 1.691vw;
`

const SwitchWrapper = styled.div`
    display: flex;
    border: 0.483vw solid #CBA044;
    border-radius: 0 8.213vw 8.213vw 0;
`

const SwitchTextContainer = styled.div`
    & {
        flex: 1;
    }
    & p {
        position: relative;
        top: 4.106vw;
        margin-left: 2.415vw;
    }
`



const SwitchContainer = styled.div`
    width: fit-content;
    position: relative;
    width: 12.077vw;
    height: 7.246vw;
`

interface Switch{
    isSelected: boolean
}
const Switch = styled.label<Switch>`
    position: relative;
    display: inline-block;
    width: 12.077vw;
    height: 7.246vw;
    margin-left: auto;
    background-color: ${props => props.isSelected ? "#FFF" : "#E6C982"};
    border-radius: 8.213vw;
`
const SwitchInput = styled.input.attrs( props => ({...props}) )`
    opacity: 1;
    width: 1vw;
    height: 1vw;    
`

interface SwitchBall{
    isSelected: boolean
}

const SwitchBall = styled.div<SwitchBall>`
    position: absolute;
    content: "";
    height: 5.314vw;
    width: 5.314vw;
    left: 1.208vw;
    bottom: 0.966vw;
    background-color: #CBA044;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
    left: ${props => props.isSelected ? "5.5" : "1"}vw;
`

interface ToggleSwitch {
    children: string
    textAlign?: "center" | "right" | "left"
    name: string
    onChange?: any
    value?: string
    selected?: any
}

const ToggleSwitch = ({name, children, onChange, value, selected}: ToggleSwitch) =>{
    
    let realName = ""
    const [field, meta] = useField({ name, onChange, value,  type: "radio" });
    
    if(children == "Adventurer of the East"){
        realName ="Adv of the East"
    } else if(children == "Adventurer of the Drunken Dragon"){
        realName = "Drunken Dragon"
    }
    else{
        realName = children
    }

    return <SwitchPadding>
        <SwitchWrapper>
            <SwitchTextContainer>
                <TextElMessiri fontsize={0} fontsizeMobile={4} color="white">{realName}</TextElMessiri>
            </SwitchTextContainer>
            <SwitchContainer>
                <Switch isSelected={selected}>
                    <SwitchInput {...field} name={name} onChange={onChange} type="radio" id={name} value={value}></SwitchInput>
                    <SwitchBall isSelected={selected}/>
                </Switch>
            </SwitchContainer>
        </SwitchWrapper>
    </SwitchPadding>
        
}

export default ToggleSwitch