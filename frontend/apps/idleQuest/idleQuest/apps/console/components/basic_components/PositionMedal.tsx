import styled from "styled-components"

const PositionMedalElement = styled.div`
    background-color: #ca9a3a;
    width: 1.5vw;
    height: 1.5vw;
    border-radius: 50%;
    display: inline-flex;
    
`

const Text = styled.p`
    color: white;
    margin: auto;
    font-family: arial;
    font-size: 0.9vw;
`



interface PositionMedalType{
    children: string
}

const PositionMedal: React.FC<PositionMedalType> = ({children}) =>{

    return(<>
        <PositionMedalElement>
            <Text>
                {children}
            </Text>
        </PositionMedalElement>
    </>
)}

export default PositionMedal