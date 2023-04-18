import styled from "styled-components"
import Image from "next/image"

const ButtonWrapper = styled.div`
    position: absolute;
    background-color: #14212C;
    padding: 0.3vw;
    display: flex;
    right: -1vw;
    top: 1vw;
    border-radius: 0.2vw;
    cursor: pointer;
    &:hover{
        img{
            opacity: 0.8;
        }
    }
`

interface RefreshButtonType {
    onClick: () => void
}

const RefreshButton: React.FC<RefreshButtonType> = ({onClick}) =>{

    return(<>
        <ButtonWrapper onClick = {onClick}>
            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/logout.png"  alt="Loagout icon" width={30} height={30}/>
        </ButtonWrapper>
    </>
)}

export default RefreshButton