import styled from "styled-components"
import {SmallButton} from "../basic_components"
import { useDispatch } from "react-redux"
import { useGeneralDispatch } from "../../../../../features/hooks"
import { setPage } from "../../features/explorerOfThiolden"

const ButtonContainerWrapper = styled.div`
    display: flex;
    padding: 0vw 0vw;
`

const ButtonWrapper = styled.div`
    width: 7vw;
    height: 4vw;
    margin-right: 2.5vw;
    &:last-child {
        margin-right: 0vw;
    }
`


const ButtonContainer = () =>{

    const generalDispatch = useGeneralDispatch()

    return(<>
    <ButtonContainerWrapper>
        <ButtonWrapper>
            <SmallButton onClick={() => generalDispatch(setPage("rarity_chart"))} srcNormal = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarity_char/rarity_chart.svg" srcOnHover="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarity_char/rarity_chart_onhover.svg"/>
        </ButtonWrapper>
        <ButtonWrapper>
            <SmallButton onClick={() => generalDispatch(setPage("roster"))} srcNormal = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/roster/roster.svg" srcOnHover="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/roster/roster_onhover.svg"/>
        </ButtonWrapper>
    </ButtonContainerWrapper>

    </>)
}

export default ButtonContainer