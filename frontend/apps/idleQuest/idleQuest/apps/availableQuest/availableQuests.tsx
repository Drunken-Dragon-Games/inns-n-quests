import styled from "styled-components";
import Image from "next/image"
import { useGetAvailableQuest } from "./hooks";
import { AvailableQuestMapping, MapDrunkenDragon, QuestPaperAvailable } from "./components/complex";

const QuestDashboardContainer =styled.div`
    width: 85%;
    height: 100vh;
    background-color: #523438;
    display: flex;
    position: relative;
    overflow: hidden;
`

const QuestDashboardWrapper = styled.div`
    width: 80vw;
    height: 50vw;
    position: relative;
    margin: auto;
    // background-image: url(./images/dashboard.png);
    background-repeat: no-repeat;
`

const Center = styled.div`
    position: relative;
`

const ImageWrapper = styled.div`
    position: absolute;
    width: 80vw;
    height: inherit;
    top: 1vw;
`

const AvailableQuests = () => {

    

    useGetAvailableQuest();

    return (<>
        <QuestDashboardContainer>

            <QuestDashboardWrapper>
                <Center>
                    
                    <ImageWrapper>
                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/dashboard.webp"  alt="dashboard" width={2100} height={1250} layout ="responsive" />
                    </ImageWrapper>
                    <AvailableQuestMapping/>
                    <MapDrunkenDragon/>
                </Center>
            </QuestDashboardWrapper>
                        
            <QuestPaperAvailable/>
    
        </QuestDashboardContainer>
    </>)
}

export default AvailableQuests