import Image from "next/image"
import styled from "styled-components";
import { DragonSilverIcon } from "../basic_components";
import { LinkDisable } from "../../../../../../utils/components/basic_components";
import { useGeneralSelector } from "../../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../../features/generalReducer"
import { useGetDragonSilver } from "../../hooks";


const Flex = styled.div`
    display: flex;
    padding: 0.8vw 1vw;
`

const ImageWrapper = styled.div`
    display: block;
    height: 1.5vw !important;
    position: relative;
    img{
        width: 1.5vw !important;
        height: 1.5vw !important;
    }
`

const BackWrapper = styled.div`
    margin-left: auto;
    cursor: pointer;

    &:hover{
        opacity: 0.5;
    }
`


const DragonSilverWrapper = styled.div`
    margin-left: 1vw;
    margin-top: 0.3vw;
    display: flex;
    
`

interface ToolTip{
    Hover: boolean
}


const ClaimDragonSilverButtonWrapper = styled.div`
    margin-left: 1vw;
    margin-top: 0.3vw;
`

const Navbar = () =>{
    
    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const dragonSilver = generalSelector.idleQuest.player.data.dragonSilver

    const dragonSilverToClaim = generalSelector.idleQuest.player.data.dragonSilverToClaim

    useGetDragonSilver()

    return (<>
    
        <Flex>
            <DragonSilverWrapper>
                <DragonSilverIcon 
                    src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver.png"
                    dragonSilver= {dragonSilver} 
                    tooltip="Dragon silver"   
                    toClaim = {false}
                />
            </DragonSilverWrapper>


            <ClaimDragonSilverButtonWrapper>
                <DragonSilverIcon 
                    src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/dragon_silver_to_claim.png"
                    dragonSilver= {dragonSilverToClaim} 
                    tooltip="Dragon silver to claim"   
                    toClaim = {false}
                />
            </ClaimDragonSilverButtonWrapper>
           

            <BackWrapper>
                <LinkDisable url={`${process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:3000/login"}`}>
                    <ImageWrapper>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/logout.png"  alt="Loagout icon" width={30} height={30}/>
                    </ImageWrapper>
                </LinkDisable>
            </BackWrapper>
            
        </Flex>
    
    </>)
}

export default Navbar