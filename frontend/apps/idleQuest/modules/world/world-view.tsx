import { ReactNode, useMemo } from "react"
import styled from "styled-components"
import { NoDragImage } from "../../utils"
import {
    useDragMapLocation, WorldMap, worldMapHeightUnits,
    worldMapLocationOffsetUnits, worldMapUriMatrix, worldMapWidthUnits
} from "./world-map-dsl"
import { WorldState } from "./world-state"

const WorldViewContainer = styled.div<{ dragging: boolean }>`
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(20,20,20,0.7);
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
    width: calc(${props => props.width} + 20px);
    heigth: calc(${props => props.height} + 20px);
    border: 10px solid #3f1904;
    filter: drop-shadow(0 0 15px rgba(0,0,0,0.9));
`

const LayerContainer = styled.div<{ height: string, width: string }>`
    position: absolute;
    width: ${props => props.width};
    heigth: ${props => props.height};
    display: inline-flex;
    flex-wrap: wrap;
`

interface MapLayerProps {
    className?: string
    children?: ReactNode
    width: string
    height: string
}

const WorldLayer = ({ className, children, width, height }: MapLayerProps ) => 
    <LayerContainer className={className} width={width} height={height}>
        {children}
    </LayerContainer>


const Layer0 = (props: { wm: WorldMap, state: WorldMapViewState } ) => 
    <WorldLayer width={props.state.mapWidth} height={props.state.mapHeight}>
        {props.state.layer0RenderMatrix.map((sector, index) => 
            <NoDragImage key={index} src={sector} width={props.wm.baseSectorWidth} height={props.wm.baseSectorHeight} units={props.wm.units} />
        )}
    </WorldLayer>


type WorldMapViewState = WorldMapViewStaticState & WorldMapViewDynamicState

interface WorldMapViewStaticState {
    layer0RenderMatrix: string[]
    mapWidth: string
    mapHeight: string
}

interface WorldMapViewDynamicState {
    locationOffset: [string, string],
}

const useWorldViewState = (worldState: WorldState): WorldMapViewState => {
    const staticState = useMemo<WorldMapViewStaticState>(() => ({
        layer0RenderMatrix: worldMapUriMatrix(worldState.worldMap),
        mapWidth: worldMapWidthUnits(worldState.worldMap),
        mapHeight: worldMapHeightUnits(worldState.worldMap),
    }), [worldState.worldMap, worldState.worldMap.units])
    const dynamicState = useMemo(() => ({
        locationOffset: worldMapLocationOffsetUnits(worldState.worldMap, worldState.viewLocation)
    }), [worldState.viewLocation])
    return { ...staticState, ...dynamicState }
}

interface WorldViewProps {
    className?: string
    worldState: WorldState
    onViewLocationChange: (newLocation: [number, number]) => void
}

const WorldView = ({ className, worldState, onViewLocationChange }: WorldViewProps) => {
    const viewState = useWorldViewState(worldState)
    const { dragging, onStartDrag } = useDragMapLocation(worldState.viewLocation, onViewLocationChange)
    return (
        <WorldViewContainer className={className} onMouseDown={onStartDrag} dragging={dragging}>
            <WorldArea width={viewState.mapWidth} height={viewState.mapHeight} locationOffset={viewState.locationOffset}>
                <Layer0 wm={worldState.worldMap} state={viewState} />
            </WorldArea>
        </WorldViewContainer>
    )
}

export default WorldView
