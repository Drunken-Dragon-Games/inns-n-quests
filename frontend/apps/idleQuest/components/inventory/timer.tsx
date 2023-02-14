import styled from "styled-components"
import Image from "next/image"
import { TextOswald } from "../../../utils/components/basic_components"
import { TakenQuest, takenQuestTimeLeft } from "../../dsl"

const DetailWrapper = styled.div`
    display: flex;
    margin-right: 0.5vw;
  
    p{
        font-weight: 200;
        margin-left: 0.2vw;
    }
`

const TimeIconWrapper = styled.div`
    padding-top: 0.1vw;
    width: 0.7vw;
    height: 1vw;
`

const Timer = ({ takenQuest }: { takenQuest: TakenQuest }) => {
    const timeLeft = takenQuestTimeLeft(takenQuest)
    return (
        <DetailWrapper>
            <TimeIconWrapper>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/time_icon.png" alt="corner detail" width={7} height={10} layout="responsive" />
            </TimeIconWrapper>
            <TextOswald fontsize={0.8} color="white">{timeLeft}</TextOswald>
        </DetailWrapper>
    )
}

export default Timer