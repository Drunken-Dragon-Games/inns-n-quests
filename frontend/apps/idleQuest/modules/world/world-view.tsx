import { useMemo } from "react"
import styled from "styled-components"
import { useDrag } from "../../utils"
import PaperMapRender from "./paper-map/paper-map-render"
import TileMapRender from "./tile-sets/tile-map-render"
import { WorldState } from "./world-state"
import { WorldTransitions } from "./world-transitions"

const WorldViewContainer = styled.div<{ dragging: boolean }>`
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(20,20,20,1);
    cursor: ${props => props.dragging ? "grabbing" : "grab"};
`

interface WorldAreaProps {
    width: string 
    height: string 
    locationOffset: [string, string] 
}

const WorldArea = styled.div.attrs<WorldAreaProps>(props => ({ style: { 
    top: `calc(${props.locationOffset[1]} + 50vh)`,   
    left: `calc(${props.locationOffset[0]} + 50vw)`,
}}))<WorldAreaProps>`
    position: relative;
    width: calc(${props => props.width});
    heigth: calc(${props => props.height});
`


type WorldMapViewState = WorldMapViewStaticState & WorldMapViewDynamicState

interface WorldMapViewStaticState {
    renderMatrix: string[][]
    mapWidth: string
    mapHeight: string
}

interface WorldMapViewDynamicState {
    locationOffset: [string, string],
}

const useWorldViewState = (worldState: WorldState): WorldMapViewState => {
    const staticState = useMemo<WorldMapViewStaticState>(() => ({
        renderMatrix: worldState.activeMap.contentMatrix(),
        mapWidth: worldState.activeMap.uwidth,
        mapHeight: worldState.activeMap.uheight,
    }), [worldState.activeMap, worldState.activeMap.metadata.units])
    const dynamicState = useMemo(() => ({
        locationOffset: worldState.activeMap.ulocationOffset(worldState.viewLocation[worldState.activeMap.metadata.name])
    }), [worldState.viewLocation])
    return { ...staticState, ...dynamicState }
}

interface WorldViewProps {
    className?: string
    worldState: WorldState
    worldTransitions: WorldTransitions
}

const WorldView = ({ className, worldState, worldTransitions }: WorldViewProps) => {
    const viewState = useWorldViewState(worldState)
    const { dragging, onStartDrag } = useDrag(
        worldState.viewLocation[worldState.activeMap.metadata.name], 
        worldState.activeMap.metadata.units.scale,
        worldTransitions.onWorldViewLocationChange)
    return (
        <WorldViewContainer className={className} onMouseDown={onStartDrag} dragging={dragging}>
            <WorldArea width={viewState.mapWidth} height={viewState.mapHeight} locationOffset={viewState.locationOffset}>

                { worldState.activeMap.metadata.contents.ctype === "paper-map-contents" ?
                    <PaperMapRender 
                        width={viewState.mapWidth} 
                        height={viewState.mapHeight} 
                        sectorWidth={worldState.activeMap.metadata.sectorSize[0]} 
                        sectorHeight={worldState.activeMap.metadata.sectorSize[1]} 
                        units={worldState.activeMap.metadata.units} 
                        renderMatrix={viewState.renderMatrix.flat()} 
                    />
                :  worldState.activeMap.metadata.contents.ctype === "tile-map-contents" ?
                    <TileMapRender 
                        tileSet={worldState.activeMap.metadata.contents.tileSet} 
                        renderMatrix={viewState.renderMatrix} 
                    />
                :<></>}

            </WorldArea>
        </WorldViewContainer>
    )
}

export default WorldView
