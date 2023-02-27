import { useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { useDrag } from "../../utils"
import PaperMapRender from "./paper-map/paper-map-render"
import TileMapRender from "./tile-sets/tile-map-render"
import { WorldState } from "./world-state"
import { WorldTransitions } from "./world-transitions"

const openAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const closeAnimation = keyframes`
    0% { opacity: 1; top: 0; }
    99% { top: 0; }
    100% { opacity: 0; top: -100vh; }
`

const WorldViewContainer = styled.div<{ open: boolean }>`
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0;
    background-color: rgba(20,20,20,1);
    ${props => props.open ? "top: 0;" : "top: -100vh;"};
    opacity: ${props => props.open ? "1" : "0"};
    animation: ${props => props.open ? openAnimation : closeAnimation} 0.5s ease-in-out;
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
    /*
    const { dragging, onStartDrag } = useDrag(
        worldState.viewLocation[worldState.activeMap.metadata.name], 
        worldState.activeMap.metadata.units.scale,
        worldTransitions.onWorldViewLocationChange)
    */
    return (
        <WorldViewContainer className={className} open={worldState.open}>
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
