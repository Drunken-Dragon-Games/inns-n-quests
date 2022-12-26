import styled from "styled-components";
import Image from "next/image"
import { useDeadCoolDown, useGetAdventurersTimmer } from "../../hooks"; 
import { TextOswald } from "../../../../../../utils/components/basic_components";

const CoolDownTimmerWrapper = styled.div`
    display: flex;
    margin-left: 0.5vw;
    margin-top: 0.15vw;

    p{
        margin-left: 0.5vw;
        margin-top: 0.1vw;
    }
`

const ImageWrapper = styled.div`
    width: 0.6vw;
    height: 0.7vw;
   
`

interface CooldownDeathTimmer{
    coolDownTime: number
}
const CooldownDeathTimmer = ({coolDownTime}: CooldownDeathTimmer) =>{

    
    const {coolDownTimeLeft, timeLeftNumber} = useDeadCoolDown(coolDownTime)
   
    //cuando cambia el tiempo del coodown timeLeft pide nuevamente a los aventureros 

    
    useGetAdventurersTimmer(timeLeftNumber)

    return(<>
        <CoolDownTimmerWrapper>
            <ImageWrapper>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/time_icon.png"  alt="drunken Dragon idel adventurers" width={60} height={100} layout="responsive" />
            </ImageWrapper>
            <TextOswald fontsize={ 0.7} color = "white">
                {`${timeLeftNumber} ${coolDownTimeLeft}`}
            </TextOswald>
        </CoolDownTimmerWrapper>
    </>)
}

export default CooldownDeathTimmer
