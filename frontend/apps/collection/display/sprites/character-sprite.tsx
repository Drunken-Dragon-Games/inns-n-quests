import { useMemo } from "react"
import styled, { keyframes } from "styled-components"
import {
    Character, notEmpty, PixelArtImage, rules, simpleHash, Units,
    useComputeHeightFromOriginalImage, useRememberLastValue, vmax1
} from "../../../common"

const ptMeasures = (character: CollectionCharacter): [number, [number,number]] => {
    if (character.assetRef === "PixelTile42")
        return [5, [0,0]]
    else 
        return [5, [0,0]]
}

const gmasMeasures = (character: CollectionCharacter): [number, [number,number]] => {
    if (character.class == "Bard")
        return [8.5, [0,0.3]]
    else if (character.class == "Rogue")
        return [8.5, [0,0.3]]
    else if (character.class == "Warlock")
        return [8.5, [0,0.3]]
    else if (character.class == "Fighter")
        return [8.5, [0,0.3]]
    else if (character.class == "Knight")
        return [8.5, [0,0.3]]
    else if (character.class == "Cleric")
        return [8.5, [0,0.3]]
    else
        return [8.5, [0,0.3]]
}

const aotMeasures = (character: CollectionCharacter): [number, [number,number]] => {
    const split = character.sprite.split('/')[5].split('-')
    const advName = split[0]
    const chroma = split[2]
    // Vilnay
    if (advName == 'astrid' && chroma == 'chroma.png')
        return [5.5, [0,0]] 
    else if (advName == 'astrid')
        return [5, [0,0]] 
    else if (advName == 'vadanna')
        return [6.5, [0,1]] 
    else if (advName == 'marlanye' && chroma == 'chroma.png')
        return [7, [0,0]] 
    else if (advName == 'marlanye')
        return [5, [0,0]] 
    else if (advName == 'volggan')
        return [5, [0,0]] 
    else if (advName == 'aragren')
        return [6.2, [0,-0.2]] 
    else if(advName == "arne")
        return [8.5, [0,1]] 
    else if (advName == 'friga')
        return [5.2, [0,-0.2]] 
    else if (advName == 'kilia')
        return [6.3, [0,1]] 
    else if (advName == 'hilana')
        return [8, [0,-0.8]] 
    else if (advName == 'perneli')
        return [5.6, [0,0.1]] 
    else if (advName == 'eify' && chroma == 'chroma.png')
        return [6.3, [0,0.4]] 
    else if (advName == 'eify')
        return [5.5, [0,0.4]] 
    else if (advName == 'bo')
        return [7.2, [0,0.5]] 
    else if (advName == 'lyskyr')
        return [7.8, [0,0.6]] 
    else if (advName == 'abbelka')
        return [8.2, [0,1]] 
    else if (advName == 'ilinmyr')
        return [12.4, [0,0.4]]
    else if (advName == 'gadrull')
        return [6.8, [0,-1.6]] 
    else if (advName == 'filgrald')
        return [6.8, [0,-1.7]] 
    else if (advName == 'mey')
        return [6.2, [0,-0.5]] 
    else if (advName == "arunna" )
        return [6.3, [0,-0.4]] 
    else if (advName == 'ferra')
        return [5.8, [0,-0.8]] 
    else if (advName == 'fjolnaer')
        return [9.2, [0,-0.2]] 

    // Auristar
    else if (advName == 'avva_ice')
        return [6.5, [0,0]] 
    else if (advName == 'avva_fire')
        return [6.5, [0,0.2]]
    else if (advName == 'aumara')
        return [6.7, [0,0.2]] 
    else if (advName == 'marendil')
        return [9.3, [0,-1]] 
    else if (advName == 'haakon')
        return [7.4, [0,-1.1]] 
    else if (advName == 'tyr')
        return [6.2, [0,-0.6]] 
    else if (advName == 'ulf')
        return [6.6, [0,0.8]] 
    else if (advName == 'othil')
        return [5.5, [0,0]] 
    else if (advName == 'vale')
        return [8.2, [0,-1]] 
    else if (advName == 'gulnim')
        return [6.8, [0,0]] 
    else if (advName == 'milnim')
        return [6.8, [0,-0.2]] 
    else if (advName == 'delthamar')
        return [6.2, [0,-1.2]] 
    else if (advName == 'naya')
        return [8.2, [0,3.2]]
    else if(advName == "drignir")
        return [7.8, [0,-1.3]] 
    else if (advName == 'shaden')
        return [5.5, [0,0.5]] 

    // Kullmyr
    else if (advName == 'rundir' && chroma == 'chroma.png')
        return [7.5, [0, -0.7]] 
    else if (advName == 'rundir')
        return [6.7, [0,-1.6]] 
    else if (advName == 'dethiol')
        return [14.2, [0,0.6]] 
    else if (advName == 'syonir')
        return [9.1, [0,-1.5]] 
    else if (advName == 'mili')
        return [5.5, [0,0.5]] 
    else if (advName == 'mare')
        return [7.7, [0,1.3]] 
    
    // Nurmyr & Jagermyr
    else if (advName == 'bodica')
        return [6.2, [0,1.2]] 
    else if (advName == "udenamvar")
        return [6.2, [0,0.2]] 
    else if (advName == 'rando')
        return [6.3, [0,-0.6]] 
    else if(advName == "aztuneio")
        return [8.4, [0,2]] 

    // Rare
    else if (advName == 'rei')
        return [7, [0,-2]] 
    else if (advName == 'thelas')
        return [6.7, [0,-0.5]] 
    else if (advName == 'arin')
        return [8, [0,2.2]] 
    else if (advName == 'aki')
        return [8.5, [0,0.9]] 

    else if(advName == "vimtyr")
        return [8.4, [0,-1]] 
    else if (advName == 'terrorhertz')
        return [6.6, [0,-1]] 

    else 
        return [1, [0,0]] 
}

const CharacterSpriteContainer = styled.div<{ dimensions: Dimensions}>`
    position: relative;
    width: ${props => props.dimensions.units.u(5)};
    height: ${props => props.dimensions.units.u(props.dimensions.height)};
    overflow: visible;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
`



const CharacterImageContainer = styled.div<{ dimensions: Dimensions }>`
    position: absolute;
    overflow: visible;
    width: ${props => props.dimensions.units.u(props.dimensions.width)};
    height: ${props => props.dimensions.units.u(props.dimensions.height)};
    margin-top: ${props => props.dimensions.units.u(props.dimensions.offset[0])};
    margin-left: ${props => props.dimensions.units.u(props.dimensions.offset[1])};
`

interface Dimensions {
    width: number
    height: number
    units: Units
    offset: [number, number]
}

interface CharacterSpriteProps {
    className?: string
    character:CollectionCharacter 
    units?: Units
}

type CollectionCharacter = {
    sprite: string,
    assetRef: string,
    collection: "pixelTiles" | "adventurersOfThiolden" | "grandMasterAdventurers",
    class: string
}

const MirroredPixelArtImage = styled(PixelArtImage)`
  transform: scaleX(-1);
`;

const CharacterSprite = ({className, character, units = vmax1 } : CharacterSpriteProps) => {
    const [width, offset] =
        character.collection == "pixelTiles" ? ptMeasures(character) :
        character.collection == "grandMasterAdventurers" ? gmasMeasures(character) : aotMeasures(character)
    const dimensions =  { width, height: 0, units, offset: offset as [number,number] }
    const height = useComputeHeightFromOriginalImage(character.sprite, dimensions.width)
    const completeDimensions = { ...dimensions, height }
    return (
        <CharacterSpriteContainer className={className} dimensions={completeDimensions}>
            <CharacterImageContainer dimensions={dimensions}>
                <MirroredPixelArtImage
                    src={character.sprite}
                    alt={character.assetRef}
                    width={completeDimensions.width}
                    height={completeDimensions.height}
                    units={completeDimensions.units}
                />
            </CharacterImageContainer>
        </CharacterSpriteContainer>
    )
}

export default CharacterSprite