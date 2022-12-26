import styled from "styled-components"
import Image from "next/image"


const CoinComponent = styled .div`
    position: relative;
    width: 3.8vw;
    height: 3.8vw;
`

const CoinWrapper = styled.div`
    position: absolute;
    width: inherit;
    height: inherit;
`

interface rewardText {
    rewardLength: number
}

const RewardText =styled.div<rewardText>`
    position: absolute;
    width: inherit;
    height: inherit;
    top: 1.5vw;

    p{
        font-family: VT323;
        font-size: ${props => props.rewardLength > 2 ? "1.5" : "1.8" }vw;
        color: #793312;
        line-height: 1.8vw;
        font-weight: 100;
        text-transform: uppercase;
        text-align: center;
    }
`

const TextPromised = styled.div`
    p{ 
        font-family: VT323;
        font-size: 1vw;
        color: #793312;
        line-height: 0.8vw;
        font-weight: 100;
        text-transform: uppercase;
        text-align: center;
    }
`

interface coinReward {
    children: string 
}

const CoinReward = ({children}:coinReward) => {

    return (<>
            <CoinComponent>
                <CoinWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/coin.svg"  
                        alt="chest" 
                        width={1000} 
                        height={1000}
                        layout = "responsive"  
                    />
                </CoinWrapper>
                <RewardText rewardLength ={children.length}>
                    <p>{children}</p>
                </RewardText>
            </CoinComponent>
            <TextPromised><p>Promised</p></TextPromised>
    </>)
}


export default CoinReward