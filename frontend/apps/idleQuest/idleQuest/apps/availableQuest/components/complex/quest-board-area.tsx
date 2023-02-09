import { PropStamp } from "../basic_components";
import Image from 'next/image'
import { AvailableQuest } from "../../../../../dsl";
import styled from "styled-components";

const Area = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10vw;
`

const MiniQuestCardWrapper = styled.div`
    cursor: pointer;
    width: 16vw;
    height: 16vw;
    position: relative;
`

const Title = styled.h2`
    position: absolute;
    top: 0vw;
    left: 0vw;
    width: 16vw; 
    height: 16vw;
    text-align: center;
    padding: 2.3vw 1.5vw;
    font-family: VT323;
    font-size: 1.2vw;
    color: #793312;
    text-transform: uppercase; 
    font-smooth: never;
    -webkit-font-smoothing : none;
`

const PaperBackground = styled(Image)`
    position: absolute;
`

const MonsterWrapper = styled.div`
    position: absolute;
    top: 5vw;
    left: 6vw;
    height: 8vw;
    width: 4vw;
`

const ScaledMoster = styled(Image)`
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`

interface QuestBoardAreaProps {
    className?: string
    availableQuests: AvailableQuest[]
    onQuestClick: (quest: AvailableQuest) => void
}

export default ({ className, availableQuests, onQuestClick }: QuestBoardAreaProps) =>
    <Area className={className}>
        {availableQuests.map((quest: AvailableQuest, index: number) => {
            if (index < 5)
                return (
                    <MiniQuestCardWrapper onClick={() => onQuestClick(quest)}>
                        <PaperBackground
                            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/paper/paper_prop_1_reverse.webp"
                            alt="quest paper image"
                            layout="fill"
                        />
                        <Title>{quest.name}</Title>
                        <MonsterWrapper>
                            <ScaledMoster
                                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/monsters/monstruo.webp"
                                alt="quest monster preview"
                                layout="fill"
                            />
                        </MonsterWrapper>
                        <PropStamp rarity="kings_plea" />
                    </MiniQuestCardWrapper>
                )
            else
                return <></>
        })}
    </Area>
