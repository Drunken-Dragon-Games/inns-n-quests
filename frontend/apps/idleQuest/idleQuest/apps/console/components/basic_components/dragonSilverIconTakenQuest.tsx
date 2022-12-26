import styled from "styled-components"
import Image from "next/image"
import { TextOswald } from "../../../../../../utils/components/basic_components"

const DetailWrapper = styled.div`
    display: flex;
    margin-right: 0.5vw;
    p{
        font-weight: 200;
        margin-left: 0.2vw;
    }
`

const DragonSilverIconWrapper = styled.div`
    width: 1.2vw;
    height: 1.2vw;
`

interface DragonSilverIconTakenQuest{
    dragonSilverReward: number
}
const DragonSilverIconTakenQuest = ({dragonSilverReward}:DragonSilverIconTakenQuest) : JSX.Element => {

    return(<>
            <DetailWrapper>
                <DragonSilverIconWrapper>
                    <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/ds_icon.png"  alt="corner detail" width={10} height={10} layout="responsive" />
                </DragonSilverIconWrapper>  
                <TextOswald color="white" fontsize={0.8}>{dragonSilverReward}</TextOswald>
            </DetailWrapper>
    
    </>)
}

export default DragonSilverIconTakenQuest