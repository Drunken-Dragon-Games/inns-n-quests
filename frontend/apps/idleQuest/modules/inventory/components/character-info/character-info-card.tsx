import { ReactNode, useState } from "react"
import styled from "styled-components"
import { Character, OswaldFontFamily } from "../../../../common"
import { px } from "../../../../utils"
import InventoryBox from "../browser/inventory-box"
import { CharacterSprite } from "../sprites"
import * as vm from "../../../../game-vm"

const CharacterInfoCardContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: rgba(30,30,30,0.5);
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-radius: 2px;

    color: white;
    ${OswaldFontFamily}
`

const CharacterName = styled.h2`

`

const CharacterClass = styled.h3`
    color: rgb(200,200,200)
`

const InfoWrapper = styled.div`
    flex: 1;
`

const Header = styled.div`
    padding: 10px;
    display: flex;
    flex-align: center;
    flex-justify: center;
`

const MiniatureBox = styled(InventoryBox)`
    width: 120px;
    height: 180px;
`

const HeaderInfo = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
`

const Skills = styled.div`
    width: 100%;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;
`
    
const APSWrapper = styled.div`
    display: flex;
    gap: 5px;
    & > * {
        width: 70px;
        font-size: 14px !important;
    }
`



const StatContainer = styled.div<{ hovering: boolean }>`
    position: relative;
    overflow: visible;
    display: flex;
    border: 2px solid rgb(40,40,40);
    border-radius: ${props => props.hovering ? "5px 5px 0px 0px" : "5px"};
    ${props => props.hovering && "filter: drop-shadow(0 0px 3px rgba(0, 0, 0, 0.5));"}
    
    background-color: ${ props => props.hovering ? "rgba(40,40,40,1)" : "rgba(20,20,20,1)"};
    font-size: 12px;
    ${props => props.hovering && "z-index: 10;"}
`

const StatName = styled.div`
    flex: 1;
    padding: 2px 8px;
    border-radius: 5px;
`

const StatValue = styled.div`
    text-align: right;
    padding: 2px 8px;
    background-color: rgba(40,40,40);
`

const StatInfo = styled.div<{ hovering: boolean }>`
    position: absolute;
    border-radius: 0px 0px 5px 5px;
    background-color: rgba(40,40,40,1);
    filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.5));
    width: calc(100% + 4px);


    top: 23px;
    left: -2px;
    display: ${props => props.hovering ? "block" : "none"};
`

const Stat = ({ children, name, value }: { children?: ReactNode, name: string, value: string }) => {
    const [hovering, setHovering] = useState(false)
    return (
        <StatContainer 
            hovering={hovering}
            onClick={() => children && setHovering(!hovering)}
            onMouseOver={() => children && setHovering(true)}
            onMouseLeave={() => children && setHovering(false)}
        >
            <StatName>{name}</StatName>
            <StatValue>{value}</StatValue>
            <StatInfo hovering={hovering}>
                {children}
            </StatInfo>
        </StatContainer>
    )
}

/*
    description: string,
    benefits: APS,
    requires: {
        aps: APS,
        classes?: (AdventurerClass | CrafterClass)[],
        skills: SkillName[],
    },
    damage?: DamageType[],
    provokes?: Condition[],
*/

const SkillInfoContainer = styled.div`
    width: 100%;
    padding: 10px;
    padding-top: 0px;
`

const SkillInfoBox = styled.div`
    width: 100%;
    padding-top: 5px;
    display: flex;
`

const SkillBenefits = styled.div`
    color: rgb(200,200,200);
    padding-right: 5px;
    font-size: 10px;
`

const SkillInfoName = styled.div`
`

const SkillInfoValue = styled.div`
    flex: 1;
    text-align: right;
    color: rgb(200,200,200);
`

const SkillDescription = styled.div`
    width: 100%;
    padding-top: 5px;
    color: rgb(200,200,200);
`

const SkillInfo = (info: vm.SkillInfo) => 
    <SkillInfoContainer>
        { info.requires.classes ? 
            <SkillBenefits key="class">{info.requires.classes.map(x => x.toUpperCase()).join(" ")} SKILL</SkillBenefits> : 
            <SkillBenefits key="tag">COMMON SKILL</SkillBenefits> 
        }
        <SkillInfoBox key="benefits">
            { info.benefits.athleticism > 0 ? <SkillBenefits key="ath">ATH {info.benefits.athleticism * 100}%</SkillBenefits> : <></> }
            { info.benefits.intellect > 0 ? <SkillBenefits key="int">INT {info.benefits.intellect * 100}%</SkillBenefits> : <></> }
            { info.benefits.charisma > 0 ? <SkillBenefits key="cha">CHA {info.benefits.charisma * 100}%</SkillBenefits> : <></> }
        </SkillInfoBox>
        { info.damage ? 
        <SkillInfoBox key="damage">
            <SkillInfoName>DAMAGE</SkillInfoName>
            <SkillInfoValue>{info.damage.map(x => 
                <p key={x}>{x.toUpperCase()}</p>
            )}</SkillInfoValue>
        </SkillInfoBox> 
        : <></>}
        { info.provokes ? 
        <SkillInfoBox key="provokes">
            <SkillInfoName>PROVOKES</SkillInfoName>
            <SkillInfoValue>{info.provokes.map(x => 
                <p key={x}>{x.toUpperCase()}</p>
            )}</SkillInfoValue>
        </SkillInfoBox> 
        : <></>}
        <SkillDescription key="description">{info.description}</SkillDescription>
    </SkillInfoContainer>

interface CharacterInfoCardProps {
    className?: string
    character: Character
}

const CharacterInfoCard = ({ className, character }: CharacterInfoCardProps) => {
    return (
        <CharacterInfoCardContainer className={className}>
            <Header>
                <MiniatureBox overflowHidden={true}>
                    <CharacterSprite
                        character={character}
                        units={px(17)}
                    />
                </MiniatureBox>
                <HeaderInfo>
                    <CharacterName>{character.name.toUpperCase()}</CharacterName>
                    <CharacterClass>{character.characterType.ctype.toUpperCase()} / {character.characterType.class.toUpperCase()}</CharacterClass>
                    <APSWrapper>
                        <Stat name="ATH" value={character.evAPS.athleticism.toString()} key="ATH" />
                        <Stat name="INT" value={character.evAPS.intellect.toString()} key="INT" />
                        <Stat name="CHA" value={character.evAPS.charisma.toString()} key="CHA" />
                    </APSWrapper>
                </HeaderInfo>
            </Header>
            <InfoWrapper>
                <Skills>
                {character.skills?.map(skill => {
                    const skillInfo = vm.Skills[skill]
                    const value = (
                        skillInfo.benefits.athleticism * character.evAPS.athleticism + 
                        skillInfo.benefits.intellect * character.evAPS.intellect + 
                        skillInfo.benefits.charisma * character.evAPS.charisma).toString()
                    return <Stat name={skill} value={value} key={skill}>
                        <SkillInfo {...skillInfo} />
                    </Stat>
                })}
                </Skills>
            </InfoWrapper>
        </CharacterInfoCardContainer>
    )
}

export default CharacterInfoCard
