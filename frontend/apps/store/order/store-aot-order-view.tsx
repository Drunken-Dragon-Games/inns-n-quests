import { useState } from "react"
import styled from "styled-components"
import { OswaldFontFamily, ScalableSimpleButton, colors } from "../../common"
import { Section } from "../components/sections"
import { storeTranstions } from "../store-transitions"

const AOTOrderContainer = styled.div<{isMobile: boolean}>`
  padding-right: ${(p)=>p.isMobile? "15px": "8vw"};
`

const NumberLabel = styled.span`
  text-align: center;
  margin-right: 5px;
  ${OswaldFontFamily};
  font-size: 30px;
  color: ${colors.infoText};
`

const NumberInput = styled.input`
  width: 90px;
  height: 60px;
  margin: 0 auto;
  background-color: ${colors.dduBackground};
  color: ${colors.dduGold};
  ${OswaldFontFamily};
  border: 2px solid #333;
  font-weight: bold;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  font-size: 35px;
`
const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  font-size: 16px;
  margin: 0 auto;
`;

export const AotOrderView = () => {
    const [amount, setAmount] = useState<number>(0)

    return (
    <AOTOrderContainer isMobile={false}>
        <Section key="aot-order" title="Adenturers of Theolden Store" colums={1}>
        <NumberLabel>Amount</NumberLabel>
            <NumberInput
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              min="0"
            />

        <NumberLabel>Method</NumberLabel>
        <ButtonContainer>
          <ScalableSimpleButton onClick={() => storeTranstions.orderAOts("Eternl", amount.toString())} height="40px" width="100px" fontSize="16px">Eternal</ScalableSimpleButton>
          <ScalableSimpleButton onClick={() => storeTranstions.orderAOts("Nami", amount.toString())} height="40px" width="100px" fontSize="16px">Nami</ScalableSimpleButton>
        </ButtonContainer>
        </Section>
    </AOTOrderContainer>) 
}