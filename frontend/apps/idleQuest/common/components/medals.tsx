import { ReactNode } from "react"
import styled from "styled-components"
import { useRememberLastValue } from "../internal-state-effects"
import { useNumberAnimation } from "../time-effects"

const MedalContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const AnimatedNumberMedalManager = ({ children, className, lastAmount, amount, animate }: AnimatedNumberMedalProps & { lastAmount: number }) => {
    const renderAmount = useNumberAnimation(lastAmount, amount, animate)
    return (
        <MedalContainer className={className}>
            <span>{renderAmount}</span>
            {children}
        </MedalContainer>
    )
}

interface AnimatedNumberMedalProps { 
    children?: ReactNode, 
    className?: string, 
    amount: number, 
    animate?: boolean 
}

export const AnimatedNumberMedal = (props: AnimatedNumberMedalProps) => {
    const lastAmount = useRememberLastValue(props.amount, 0)
    return <AnimatedNumberMedalManager {...{ ...props, lastAmount }} />
}

export const Medal = ({ children, className }: { children?: ReactNode, className?: string }) => 
    <MedalContainer className={className}>
        {children}
    </MedalContainer>
