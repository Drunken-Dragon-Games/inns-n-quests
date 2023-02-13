import Image from "next/image"
import styled, { keyframes } from "styled-components"
import { TextElMessiri } from "../../../../../../utils/components/basic_components"

const TabsContainer = styled.div`
    position: relative;
    width: 100%;
    height: 2.3vmax;
    display: flex;
    align-items: center;
`

const glow = keyframes`
    100% {text-shadow: 0 0 1px rgba(255, 255, 255, 0.2), 0 0 2px rgba(255, 255, 255, 0.2), 0 0 3px rgba(255, 255, 255, 0.2), 0 0 4px rgba(255, 255, 255, 0.2), 0 0 5px rgba(255, 255, 255, 0.2), 0 0 6px rgba(255, 255, 255, 0.2); }
`

const TabButton = styled.div<{ glow: boolean }>`
    height: 2.3vmax;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover{
        color: white !important;
    }
    p{
        margin-top: 0.3vmax;
        ${props => props.glow ? "color: #C58E31 !important;": ""}
        animation: ${props => props.glow  ?  glow : ""} 0.5s ease-in-out infinite alternate;
        text-align: center;
    }
`

const BackgroundImage = styled(Image)`
    position: absolute;
`

export type TabNames = "inventory" | "quests-in-progress"

interface ConsoleTabsProps {
    page: TabNames,
    completedQuests: number,
    onTabClick: (tab: TabNames) => void
}

const ConsoleTabs = ({ page, completedQuests, onTabClick }: ConsoleTabsProps) =>
    <TabsContainer>
        <BackgroundImage
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/console/quest_buttons_container.png"
            alt="ornament" //width={400} height={75} layout="responsive" 
            layout="fill"
        />
        <TabButton onClick={() => onTabClick("inventory")} glow={false}>
            <TextElMessiri fontsize={0.8} color={page == "inventory" ? "white" : "#5B646C"}>ADVENTURERS</TextElMessiri>
        </TabButton>
        <TabButton onClick={() => onTabClick("quests-in-progress")} glow={completedQuests > 0}>
            <TextElMessiri fontsize={0.8} color={page == "quests-in-progress" ? "white" : "#5B646C"}>IN PROGRESS</TextElMessiri>
        </TabButton>
    </TabsContainer>

export default ConsoleTabs