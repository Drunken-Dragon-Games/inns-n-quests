import { MouseEventHandler, ReactNode, useEffect, useMemo, useState } from "react"
import styled, { keyframes } from "styled-components"
import { useDragMapLocation, WorldMap, worldMapHeightUnits, worldMapLocationOffsetUnits, worldMapUriMatrix, worldMapWidthUnits } from "../../dsl"
import { NoDragImage, useRememberLastValue } from "../../utils"

const WorldMapViewContainer = styled.div<{ dragging: boolean }>`
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(20,20,20,0.7);
    cursor: ${props => props.dragging ? "grabbing" : "grab"};
`

interface WorldMapAreaProps {
    width: string 
    height: string 
    locationOffset: [string, string] 
}

const WorldMapArea = styled.div.attrs<WorldMapAreaProps>(props => ({ style: { 
    top: `calc(${props.locationOffset[1]} + 50vh)`,   
    left: `calc(${props.locationOffset[0]} + 50vw)`,
}}))<WorldMapAreaProps>`
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

const MapLayer = ({ className, children, width, height }: MapLayerProps ) => 
    <LayerContainer className={className} width={width} height={height}>
        {children}
    </LayerContainer>


const Layer0 = (props: { wm: WorldMap, state: WorldMapViewState } ) => 
    <MapLayer width={props.state.mapWidth} height={props.state.mapHeight}>
        {props.state.layer0RenderMatrix.map((sector, index) => 
            <NoDragImage key={index} src={sector} width={props.wm.baseSectorWidth} height={props.wm.baseSectorHeight} units={props.wm.units} />
        )}
    </MapLayer>


type WorldMapViewState = WorldMapViewStaticState & WorldMapViewDynamicState

interface WorldMapViewStaticState {
    layer0RenderMatrix: string[]
    mapWidth: string
    mapHeight: string
}

interface WorldMapViewDynamicState {
    locationOffset: [string, string],
}

const useWorldMapViewState = (props: WorldMapViewProps): WorldMapViewState => {
    const staticState = useMemo<WorldMapViewStaticState>(() => ({
        layer0RenderMatrix: worldMapUriMatrix(props.wm),
        mapWidth: worldMapWidthUnits(props.wm),
        mapHeight: worldMapHeightUnits(props.wm),
    }), [props.wm, props.wm.units])
    const dynamicState = useMemo(() => ({
        locationOffset: worldMapLocationOffsetUnits(props.wm, props.currentLocation)
    }), [props.currentLocation])
    return { ...staticState, ...dynamicState }
}

interface WorldMapViewProps {
    className?: string
    wm: WorldMap
    currentLocation: [number, number]
    onLocationChange: (newLocation: [number, number]) => void
}

const WorldMapView = (props: WorldMapViewProps) => {
    const state = useWorldMapViewState(props)
    const { dragging, onStartDrag } = useDragMapLocation(props.currentLocation, props.onLocationChange)
    return (
        <WorldMapViewContainer className={props.className} onMouseDown={onStartDrag} dragging={dragging}>
            <WorldMapArea width={state.mapWidth} height={state.mapHeight} locationOffset={state.locationOffset}>
                <Layer0 wm={props.wm} state={state} />
            </WorldMapArea>
        </WorldMapViewContainer>
    )
}

export default WorldMapView
