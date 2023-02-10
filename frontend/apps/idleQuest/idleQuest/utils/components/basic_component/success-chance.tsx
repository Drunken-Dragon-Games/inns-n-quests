import styled from "styled-components"
import Image from "next/image"

const SucceedChanceWrapper = styled.div`
    width: 9vw;
    margin-left: auto;
    margin-right: 2.5vw;
`

const Test = styled.p`
    font-family: VT323;
    font-size: 1.2vw;
    color: #793312;
    line-height: 1.5vw;
    font-weight: 100;
    text-align: center;
    text-transform: uppercase;
`

const PercentageElement = styled.div`
    display: flex;
    justify-content: center;
`

const CloverImages = styled.div`
    width: 3.6vw;
    height: 2vw;
    margin-left: -0.5vw;
`

const PercentageTest = styled.div`
    p{
        font-family: VT323;
        font-size: 3.5vw;
        color: #793312;
        line-height: 2vw;
        font-weight: 100;
        text-transform: uppercase;
    }
`

interface SucceedChance{
    className?: string
    percentage: number
}

export default ({ className, percentage }: SucceedChance) => 
    <SucceedChanceWrapper className={className}>
        <Test>Success chance</Test>
        <PercentageElement>
            <CloverImages>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/clover.svg" alt="clover drunken Dragon" width={2000} height={1250} />
            </CloverImages>
            <PercentageTest>
                <p>{percentage}%</p>
            </PercentageTest>
        </PercentageElement>
    </SucceedChanceWrapper>
