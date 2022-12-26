import styled, { keyframes } from "styled-components"


const intro = keyframes`
    0% { opacity: 0; }
    100% {opacity: 1;}
`

const SelectComponent = styled.div`
    width: auto;
    padding: 1vw 0.5vw;
    background-color: #14212C;
    border-radius: 1vw;
    animation: ${intro} 0.3s;

    @media only screen and (max-width: 414px) {
        padding: 3vw 1.5vw;
    }
`


interface select {
    children: JSX.Element | JSX.Element []
}


const Select = ({ children} : select) : JSX.Element => {
    return(<>
        <SelectComponent>
            {children}
        </SelectComponent>

    </>)
}

export default Select