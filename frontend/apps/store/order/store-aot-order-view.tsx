import styled from "styled-components"
import { Section } from "../components/sections"
import { colors } from "../../common"

const AOTOrderContainer = styled.div<{isMobile: boolean}>`
  padding-right: ${(p)=>p.isMobile? "15px": "8vw"};
`

export const AotOrderView = () => {
    return (
    <AOTOrderContainer isMobile={false}>
        <Section key="aot-order" title="Adenturers of theolden" colums={1}>
            Store
        </Section>
    </AOTOrderContainer>) 
}