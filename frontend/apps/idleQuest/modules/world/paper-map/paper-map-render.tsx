import { ReactNode } from "react"
import styled from "styled-components"
import { NoDragImage, Units } from "../../../utils"

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

interface PaperMapRenderProps {
    width: string
    height: string
    sectorWidth: number
    sectorHeight: number
    units: Units
    renderMatrix: string[]
}

const PaperMapRender = ({ width, height, sectorWidth, sectorHeight, units, renderMatrix }: PaperMapRenderProps ) => 
    <MapLayer width={width} height={height}>
        {renderMatrix.map((sector, index) => 
            <NoDragImage 
                key={index} 
                src={sector} 
                width={sectorWidth} 
                height={sectorHeight} 
                units={units} 
            />
        )}
    </MapLayer>

export default PaperMapRender