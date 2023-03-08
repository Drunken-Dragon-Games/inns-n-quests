import { useMemo } from "react"
import styled from "styled-components"
import { PixelArtImage } from "../../../common"
import { TileSet, TilesRenderMatrix } from "./tile-sets-dsl"

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
        imageAlt: `${tileSet.metadata.name} ${render} tile`,
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
            { render !== "" ?
                <PixelArtImage
                    src={state.imageSrc}
                    alt={state.imageAlt}
                    width={state.imageWidth}
                    height={state.imageHeight}
                    units={tileSet.metadata.proportions.units}
                    absolute
                />
            : <></>}
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

type TileMapRenderProps<Tid extends string> = {
    tileSet: TileSet<Tid>
    renderMatrix: TilesRenderMatrix<Tid>
}

const TileMapRender = <Tid extends string>({ tileSet, renderMatrix }: TileMapRenderProps<Tid>) => {
    const [width, height] = useMemo(() => [ 
        tileSet.renderMatrixWidthUnits(renderMatrix),
        tileSet.renderMatrixHeightUnits(renderMatrix)
    ], [tileSet, renderMatrix.length, renderMatrix[0].length])
    return (
        <TileMapContainer width={width} height={height}>
            {renderMatrix.map((row, y) => row.flatMap((render, x) => 
                <Tile key={`${x}-${y}`} tileSet={tileSet} render={render} />
            ))}
        </TileMapContainer>
    )
}

export default TileMapRender
