import { useState } from "react"
import styled from "styled-components"
import { Loading } from "../../../utils/components/basic_components"
import { If } from "../../common"
import { usePhaserRender } from "./phaser-render"

const OverworldContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
`

const LoadingBackground = styled.section`
    position: absolute;
    z-index: 29;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #0B1015;
`

const PhaserContainerId = "overworld-phaser-container"

const OverworldView = () => {
    const [ready, setReady] = useState(false)
    usePhaserRender(PhaserContainerId, () => setReady(true))

    return <>
        <If $if={!ready}>
            <LoadingBackground>
                <Loading size={8} />
            </LoadingBackground>
        </If>
        <OverworldContainer id={PhaserContainerId} key={PhaserContainerId} />
    </>
}

export default OverworldView
