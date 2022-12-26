import styled from "styled-components"
import { SelectOptionCard, TextElMessiri, SelectIcon } from './'
import Image from "next/image"
import { useState } from "react"


const SelectWrapper = styled.div`
    position: relative;
    width: 2.552vw;
    height: 2.35vw;
`
interface OptionStack {
    hover: boolean
    textAlign?: "left" | "right"
}
const OptionStack = styled.div<OptionStack>`
    width: 7.632vw;
    position: absolute;
    visibility: ${props => props.hover ? "visible": "hidden"};
    opacity: ${props => props.hover ? "1": "0"};
    transition: visibility 0.2s, opacity 0.2s;
    ${props => props.textAlign ? "right: 0vw" : ""};
`

interface SelectTitle{
    textAlign?: "left" | "right"
}

const SelectTitle = styled.div<SelectTitle>`
    border: 0.13vw solid #C58E31;
    border-radius: ${props => props.textAlign ? "1.5vw 0vw" :"0vw 1.5vw"} 0vw 0vw;
    padding: 0.15vw 0.7vw 0vw 0.7vw; 
    background-color: #090D0E; 
`

interface IconWrapper {
    hover: boolean
}

const IconWrapper = styled.div<IconWrapper>`
    border: 0.13vw solid;
    border-color: ${props => props.hover ? "#C58E31" : "rgba(0,0,0,0)"};
    border-bottom: none;
    border-radius: 1.5vw 1.5vw 0vw 0vw;
    margin-bottom: 0.5vw;
    padding: 0.25vw;
    width: 2.552vw;
    height: 2.35vw;
    cursor: pointer;
    transition: border-color 0.3s;
`

interface Select {
    icon: string
    children: string
    options: string []
    textAlign?: "left" | "right"
    name: string
    onChange?: any
    selectedValue: string
    icon_src_active: string
}

const Select =({icon, children, options, textAlign, name, onChange, selectedValue, icon_src_active}: Select) =>{

    const [hover, setHover] = useState<boolean>(false)
   

    return (<>
        <SelectWrapper>
            <IconWrapper 
                hover = {hover} 
                onMouseOver = { () => setHover(true)} 
                onMouseLeave= { () => setHover(false)}
            >
                <SelectIcon icon_src={icon} isActive={selectedValue !== ""} icon_src_active={icon_src_active}/>
            </IconWrapper>
            <OptionStack 
                hover = {hover} 
                textAlign ={textAlign} 
                onMouseOver = { () => setHover(true)} 
                onMouseLeave= { ()=> setHover(false)}
            >
                <SelectTitle textAlign ={textAlign}>
                    <TextElMessiri fontsize= {1.227} color= "white" textAlign={textAlign}>
                        {children}
                    </TextElMessiri>
                </SelectTitle>
                <SelectOptionCard 
                    name={name} 
                    onChange ={onChange} 
                    value="" 
                    textAlign = {textAlign} 
                    selected ={ selectedValue == "option" }
                >All</SelectOptionCard>
                {options.map((option)=>{
                    return <SelectOptionCard 
                        name={name} 
                        onChange ={onChange} 
                        value={option} 
                        key={option} 
                        textAlign = {textAlign} 
                        selected ={ selectedValue == option }
                    >{option}</SelectOptionCard>
                })}
            </OptionStack>
        </SelectWrapper>
    </>)
}

export default Select