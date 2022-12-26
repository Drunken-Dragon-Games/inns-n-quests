import styled from "styled-components";
import { useGetTimeLeft } from "../../hooks"
import { useTimmerOverQuestInProgress } from "../../hooks"
import Image from "next/image";
import { TextOswald } from "../../../../../../utils/components/basic_components";

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

interface Timmer {
    startTime: any,
    duration: any,
    questStatus: "failed" | "succeeded" | "in_progress" | null
}


const Timmer = ({startTime, duration, questStatus}:Timmer ) => {
    
    //esta funcion regresa el tiempo restante que queda para que un evento acabe
    // FIXME: time doesnt work
    const [ timeLeft, completeDuration ] = useGetTimeLeft(startTime, duration, true)

    useTimmerOverQuestInProgress(timeLeft, questStatus)
    
    return(<>

            <DetailWrapper>
                <TimeIconWrapper>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/time_icon.png"  alt="corner detail" width={7} height={10} layout="responsive" />
                </TimeIconWrapper>
                <TextOswald fontsize={0.8} color="white">{timeLeft}</TextOswald>
            </DetailWrapper>
            
    </>)
}

export default Timmer