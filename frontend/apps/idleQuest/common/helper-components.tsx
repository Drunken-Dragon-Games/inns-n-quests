import { ReactNode } from "react"
import styled from "styled-components"

export const Push = styled.div`
    flex: 1;
`

export const If = ({children, $if}: { children: ReactNode, $if?: boolean }) => 
    $if ? <>{children}</> : <></>