import { HTMLAttributes } from "react"
import styled from "styled-components"
import { useRememberLastValue } from "../internal-state-effects"
import { useNumberAnimation } from "../time-effects"

const MedalContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const AnimatedNumberMedalManager = ({ children, lastAmount, amount, animate, ...rest }: AnimatedNumberMedalProps & { lastAmount: number }) => {
    const renderAmount = useNumberAnimation(lastAmount, amount, animate)
    return (
        <MedalContainer {...rest}>
            <span>{renderAmount}</span>
            {children}
        </MedalContainer>
    )
}

interface AnimatedNumberMedalProps extends HTMLAttributes<HTMLDivElement> { 
    amount: number, 
    animate?: boolean 
}

export const AnimatedNumberMedal = (props: AnimatedNumberMedalProps) => {
    const lastAmount = useRememberLastValue(props.amount, 0)
    return <AnimatedNumberMedalManager {...{ ...props, lastAmount }} />
}

export const Medal = (props: HTMLAttributes<HTMLDivElement>) => 
    <MedalContainer {...props} />
