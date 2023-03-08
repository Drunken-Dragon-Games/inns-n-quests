import { useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { useRememberLastValue } from ".."

const ExperienceAnimation = (start: number, experience: number) => keyframes`
    0% {width: ${start}%;}
    100% {width: ${experience}%;}
`

const ProgressBarContainer = styled.div`
    height: 10px;
    min-width: 100px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #796257;
`

const ProgressBarProgress = styled.div<{ start: number, progress: number, animate: boolean }>`
    height: inherit;
    background-color: #793312;
    width: ${props => props.progress}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.start, props.progress) : "none"} 2s;
    position: relative;
    filter: drop-shadow(0px 0px 0.2vh rgba(0, 0, 0, 0.5));
    span {
        font-family: Oswald;
        position: absolute;
        display: block;
        padding: 0;
        margin: -0.4vh 0 0 0.4vh;
        font-size: 1.3vh;
        font-weight: bold;
    }
`

const ProgressBar = (props: { className?: string, maxValue: number, currentValue: number, reverse?: boolean }) => {
    const progress = useMemo(() => {
        const p = Math.min(props.currentValue * 100 / props.maxValue, 100)
        return props.reverse ? 100 - p : p
    }, [props.maxValue, props.currentValue, props.reverse])
    const lastProgress = useRememberLastValue(progress, 0)
    return (
        <ProgressBarContainer className={props.className}>
            <ProgressBarProgress start={lastProgress} progress={progress} animate={true}>
            </ProgressBarProgress>
        </ProgressBarContainer>
    )
}

export default ProgressBar
