import styled from "styled-components"
import { PixelCheckbox } from "."
import { useValidateRequirements } from "../../hooks"


const RequirementWrapper = styled.div`
    display: flex;
`

const PixelCheckBoxWrapper = styled.div`
    margin: auto 0vw;
`


const TextRequirementWrapper = styled.div`
    margin-left: 0.5vw;
`

const TextRequirement = styled.p`
    font-family: VT323;
    font-size: 1vw;
    color: #793312;
    line-height: 1.2vw;
    font-weight: 100;
    text-transform: uppercase;
`

interface questRequirement{
    data: requirement 
    children: string [] | string
    adventuresSelected: string []
}

interface requirement{
    character?: character []
    all?: boolean
}


interface character {
    class?: string
    race?: string
}


const QuestRequirement = ({data, children, adventuresSelected}: questRequirement) =>{


    const [isValidate] = useValidateRequirements(adventuresSelected, data)


    return (<>
                <RequirementWrapper>

                    <PixelCheckBoxWrapper>
                        <PixelCheckbox isChecked={isValidate}/>
                    </PixelCheckBoxWrapper>
                    
                    <TextRequirementWrapper>
                        <TextRequirement>
                             {children}
                        </TextRequirement>
                    </TextRequirementWrapper>

                </RequirementWrapper>
    </>)
}

export default QuestRequirement