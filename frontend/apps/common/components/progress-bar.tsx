import { ReactNode, useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { useRememberLastValue } from "../internal-state-effects"

const ExperienceAnimation = (start: number, experience: number) => keyframes`
    0% {width: ${start}%;}
    100% {width: ${experience}%;}
`

const ProgressBarContainer = styled.div<{ backgroundColor?: string }>`
    height: 1vh;
    width: 8vh;
    border-radius: 5px;
    overflow: hidden;
    color: white;
    background-color: ${ props => props.backgroundColor ?? "#796257" };
`

const ProgressBarProgress = styled.div<{ start: number, progress: number, animate: boolean, progressColor?: string }>`
    height: 100%;
    background-color: ${ props => props.progressColor ?? "#793312" };
    width: ${props => props.progress}%;
    animation: ${props => props.animate ? ExperienceAnimation(props.start, props.progress) : "none"} 2s;
    filter: drop-shadow(0px 0px 0.2vh rgba(0, 0, 0, 0.5));
`

const ProgressBar = (props: { 
    className?: string, 
    children?: ReactNode, 
    maxValue: number, 
    currentValue: number, 
    reverse?: boolean 
    backgroundColor?: string,
    progressColor?: string,
}) => {
    const progress = useMemo(() => {
        const p = Math.min(props.currentValue * 100 / props.maxValue, 100)
        return props.reverse ? 100 - p : p
    }, [props.maxValue, props.currentValue, props.reverse])
    const lastProgress = useRememberLastValue(progress, 0)
    return (
        <ProgressBarContainer className={props.className} backgroundColor={props.backgroundColor}>
            <ProgressBarProgress start={lastProgress} progress={progress} animate={true} progressColor={props.progressColor}/>
        </ProgressBarContainer>
    )
}

export default ProgressBar
