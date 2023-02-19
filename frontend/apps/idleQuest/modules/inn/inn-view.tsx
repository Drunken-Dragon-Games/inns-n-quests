import styled from "styled-components"
import { PixelArtImage, px, Units } from "../../utils"

const buildingSpriteSheet = "https://cdn.ddu.gg/sprite-sheets/idle-quests/tavern_building.png"

const InnViewContainer = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgb(20,20,20);
`

const TileMapContainer = styled.div`
    position: absolute;
    left: 40vw;
    top: 40vh;
    background-color: red;
` 

const TileContainer = styled.div<{ units: Units }>`
    width: ${props => props.units.u(32)};
    height: ${props => props.units.u(32 * 1)};

`

const TileImage = styled(PixelArtImage)`
    left: -${props => props.units!.u(32 * 0)};
    top: ${props => props.units!.u(32 * 2)};
`

const Tile = ({ units }: { units: Units }) => {
    return (
        <TileContainer units={units}>
            <TileImage
                src={buildingSpriteSheet}
                alt="Tavern spritesheet"
                width={544}
                height={208}
                units={units}
                absolute
            />
        </TileContainer>
    )
}

const TileMap = () => {
    return (
        <TileMapContainer>
            <Tile units={px(3)} />
        </TileMapContainer>
    )
}

interface InnViewProps {
    className?: string
}

const InnView = ({ className }: InnViewProps) => {
    return (
        <InnViewContainer className={className}>
            <TileMap />
        </InnViewContainer>
    )
}

export default InnView