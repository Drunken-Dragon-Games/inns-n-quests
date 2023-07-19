import styled from "styled-components"
import {
    Character, notEmpty, PixelArtImage, rules, simpleHash, Units,
    useComputeHeightFromOriginalImage, useRememberLastValue, vmax1, px,
    NoDragImage, Video
} from "../../common"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { DisplayTransitions } from "./display-transitions"
import { DisplasyState } from "./display-state"
const CardContainer = styled.div`
    width: 100%;
    padding: 5vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media only screen and (max-width: 1400px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

const isVideoFile = (src: string): boolean => {
    return src.endsWith('.mp4')
}

export const CollectionView = ({ userInfo }: { userInfo: UserInfo }) => {
    const { collectionItems } = useSelector((state: DisplasyState) => ({
        collectionItems: state.collectionItems
    }))
    useEffect(() => {
        userInfo ? DisplayTransitions.getCollection() : DisplayTransitions.getCollection()
    }, [userInfo])
    return <CardContainer>
    {collectionItems.map((src, index) => {
        if (isVideoFile(src)) {
            return (
                <Video 
                    key={index}
                    src={src}
                    height={5}
                    width={5}
                    units={vmax1}
                />
            )
        } else {
            return (
                <PixelArtImage
                    key={index}
                    src={src}
                    alt={"Art image"}
                    height={5}
                    width={5}
                />
            )
        }
    })}
    </CardContainer>
    }
    