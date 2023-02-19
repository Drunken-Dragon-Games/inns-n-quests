import styled from "styled-components"
import TileMap from "./components/tile-map"
import { TavernBuildingTile, TavernBuildingTileSet } from "./tile-sets"
import { RenderMatrix } from "./tile-sets-dsl"

const test: RenderMatrix<TavernBuildingTile> = [
    ["wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
    ["wooden-floor-1", "wooden-floor-1", "wooden-floor-1"],
]

const InnViewContainer = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgb(20,20,20);
`

interface InnViewProps {
    className?: string
}

const InnView = ({ className }: InnViewProps) => {
    return (
        <InnViewContainer className={className}>
            <TileMap tileSet={TavernBuildingTileSet.scaleBy(2)} renderMatrix={test} />
        </InnViewContainer>
    )
}

export default InnView