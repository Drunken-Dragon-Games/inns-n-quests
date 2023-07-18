import { UserInfo } from "../account-dsl"
import styled from "styled-components"
import {
    Character, notEmpty, PixelArtImage, rules, simpleHash, Units,
    useComputeHeightFromOriginalImage, useRememberLastValue, vmax1, px,
    NoDragImage, Video
} from "../../common"
import { useSelector } from "react-redux"
import { AccountState } from "../account-state"
import { useEffect } from "react"
import { AccountTransitions } from "../account-transitions"
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
    const { collectionItems } = useSelector((state: AccountState) => ({
        collectionItems: state.collectionItems
    }))
    useEffect(() => {
        userInfo ? AccountTransitions.getUserOpenBallots() : AccountTransitions.getOpenBallots()
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
            );
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
    