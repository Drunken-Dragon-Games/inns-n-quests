import { UserInfo } from "../account-dsl"
import styled from "styled-components"
const CardContainer = styled.div`
    width: 100%;
    padding: 5vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media only screen and (max-width: 1400px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

export const CollectionView = ({ userInfo }: { userInfo: UserInfo }) => 
    <>
    </>