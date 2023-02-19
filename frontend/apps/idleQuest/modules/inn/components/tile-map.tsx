import { useMemo } from "react"
import styled from "styled-components"
import { PixelArtImage } from "../../../utils"
import { TileSet, RenderMatrix } from "../tile-sets-dsl"

const TileContainer = styled.div<{ width: string, height: string }>`
    width: ${props => props.width};
    height: ${props => props.height};
    overflow: visible;
    display: flex;
    display-direction: column-reverse;

    background-color: blue;
`

type TileState = {
    imageWidth: number
    imageHeight: number
    imageAlt: string
    imageSrc: string
    containerWidth: string
    containerHeight: string
}

const useTileState = <Tid extends string>({ tileSet, render }: TileProps<Tid>): TileState => {
    return useMemo(() => ({
        imageWidth: tileSet.sizeWidth(render),
        imageHeight: tileSet.sizeHeight(render),
        imageAlt: `${tileSet.name} ${render} tile`,
        imageSrc: tileSet.tileSrc(render),
        containerWidth: tileSet.sizeWidthUnits(render),
        containerHeight: tileSet.sizeHeightUnits(render),
    }), [tileSet, render])
}

type TileProps<Tid extends string> = {
    tileSet: TileSet<Tid>
    render: Tid
}

const Tile = <Tid extends string>({ tileSet, render }: TileProps<Tid>) => {
    const state = useTileState({ tileSet, render })
    return (
        <TileContainer width={state.containerWidth} height={state.containerHeight}>
            <PixelArtImage
                src={state.imageSrc}
                alt={state.imageAlt}
                width={state.imageWidth}
                height={state.imageHeight}
                units={tileSet.proportions.units}
                absolute
            />
        </TileContainer>
    )
}

const TileMapContainer = styled.div<{ width: string, height: string }>`
    position: absolute;
    width: ${props => props.width};
    height: ${props => props.height};
    display: flex;
    flex-wrap: wrap;

    background-color: red;
` 

type TileMapProps<Tid extends string> = {
    tileSet: TileSet<Tid>
    renderMatrix: RenderMatrix<Tid>
}

const TileMap = <Tid extends string>({ tileSet, renderMatrix }: TileMapProps<Tid>) => {
    const [width, height] = useMemo(() => [ 
        tileSet.renderMatrixWidthUnits(renderMatrix),
        tileSet.renderMatrixHeightUnits(renderMatrix)
    ], [tileSet, renderMatrix.length, renderMatrix[0].length])
    return (
        <TileMapContainer width={width} height={height}>
            {renderMatrix.map((row, y) => row.flatMap((render, x) => 
                <Tile tileSet={tileSet} render={render} />
            ))}
        </TileMapContainer>
    )
}

export default TileMap
