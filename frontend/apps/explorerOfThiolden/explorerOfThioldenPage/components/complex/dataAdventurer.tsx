import styled from "styled-components"
import { AdventurerName, Lore, AdventurerStats, Artists } from "../basic_components"
import { adventurersData } from "../../data/data"
import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"


const DataAdventurerComponent = styled.div`
    width: 18.177vw;
    @media only screen and (max-width: 414px) {
        width: 100%;
    }
`

const MarginTopAdventurerStats = styled.div`
    margin-top: 4vw;
    
    @media only screen and (max-width: 414px) {
        margin-top: 7vw;
    }
`

const MarginTopArtists = styled.div`
    margin-top: 2vw;
    @media only screen and (max-width: 414px) {
        margin-top: 15vw;
    }
`

interface adventurersData{
    terrorhertz : adenturers
    vimtyr: adenturers
    aki: adenturers
    othil: adenturers
    tyr: adenturers
    ulf: adenturers
    marendil: adenturers
    haakon: adenturers
    vale: adenturers
    naya: adenturers
    shaden: adenturers
    drignir: adenturers
    gulnim: adenturers
    avva: adenturers
    delthamar: adenturers
    aumara: adenturers
    milnim : adenturers
}

interface adenturers{
    Adventurer: string
    Title: string
    Race: string
    Age: string
    Faction: string
    "Game Class": string
    "Lore Class": string
    "Concept Artists"?: string []
    "Splash Art Composition Artists"?: string []
    "Pixel Artists"?: string []
    "Miniature Pixel Artists"?: string []

}


const DataAdventurer = () =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const selected = generalSelector.exploreOfThioldenReducer.data.selected
    const info = generalSelector.exploreOfThioldenReducer.data.data[selected!]
    const adventurer = info !== undefined ? (adventurersData[(info.Adventurer as keyof adventurersData )] as adenturers): undefined
        
    return (<>
            
                    <DataAdventurerComponent>
                        {adventurer !== undefined ?
                                <>
                                    <AdventurerName name={adventurer.Adventurer} title={adventurer.Title} number={info.tokenNumber}/>
                                    <Lore gameClass={adventurer["Game Class"]} years={adventurer.Age} race={adventurer.Race} name={adventurer.Adventurer}/>
                                    <MarginTopAdventurerStats>
                                        <AdventurerStats
                                            src_miniature = {info.image}
                                            Faction = {adventurer.Faction}
                                            Game_Class = {adventurer["Game Class"]}
                                            Athleticism = {info.athleticism }
                                            Intellect = {info.intellect }
                                            Charisma = { info.charisma }
                                        />
                                    </MarginTopAdventurerStats>
                                    <MarginTopArtists>
                                    
                                        <Artists 
                                            composition={adventurer["Splash Art Composition Artists"]!}
                                            concept = {adventurer["Concept Artists"]!}
                                            miniature= {adventurer["Miniature Pixel Artists"]!}
                                            illustration = {adventurer["Pixel Artists"]!}
                                        />
                                    </MarginTopArtists>
                                </>
                        : null
            
                        }
                    </DataAdventurerComponent>

    
    </>)
}

export default DataAdventurer