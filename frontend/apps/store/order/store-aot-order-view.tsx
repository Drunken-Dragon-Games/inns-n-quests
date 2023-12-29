import { useState } from "react"
import styled from "styled-components"
import { MessiriFontFamily, OswaldFontFamily, ScalableSimpleButton, colors } from "../../common"
import { Section } from "../components/sections"
import { storeTranstions } from "../store-transitions"
import { AotOrderState } from "../store-state-models"

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

interface OrderLabelProps {
  status: string;
}

const OrderLabel = styled.span<OrderLabelProps>`
  text-align: center;
  margin-right: 5px;
  ${MessiriFontFamily};
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => {
    switch (props.status) {
      case "Getting Transaction":
      case "Connecting to Wallet":
      case "Submitting Transaction":
      case "Waiting for Signature":
      case "Waiting for Confirmation":
        return colors.textBeige; // in-progress states
      case 'Transaction Confirmed!':
        return colors.successText; // success state
      case 'Error':
        return colors.failText; // error state
      default:
        return colors.infoText;
    }
  }};
`;


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

type AotOrderViewProps = {status: AotOrderState}
type OrderStatusProps = {status: AotOrderState}
type ButtonsProps = {amount: number}
type ActionSectionProps = OrderStatusProps & ButtonsProps

const OrderStatusDisplay = ({ status }: OrderStatusProps) => {

  return (
    <>
      {status.ctype != "Error" ?
        <OrderLabel status={status.ctype}>{status.ctype}</OrderLabel>:
        <OrderLabel status={status.ctype}>Error: {status.details}</OrderLabel>
      }
    </>
  );
};

const OrderButtons = ({amount}: ButtonsProps) => {
  return (
  <ButtonContainer>
      <ScalableSimpleButton onClick={() => storeTranstions.orderAOts("Eternl", amount.toString())} height="40px" width="100px" fontSize="16px">Eternal</ScalableSimpleButton>
      <ScalableSimpleButton onClick={() => storeTranstions.orderAOts("Nami", amount.toString())} height="40px" width="100px" fontSize="16px">Nami</ScalableSimpleButton>
  </ButtonContainer>
  )
}

const ActionSection = ({amount, status}: ActionSectionProps) => {
  return (
    <>{status.ctype == "Idle" ?
      <>
        <NumberLabel>Method</NumberLabel>
        <OrderButtons amount={amount}/>
      </> :
      <OrderStatusDisplay status={status}/>}</>
  )
}

export const AotOrderView = ({ status }: AotOrderViewProps) => {
  const [amount, setAmount] = useState<number>(0);

  const isIdle = status.ctype === "Idle";

  return (
    <AOTOrderContainer isMobile={false}>
      <Section key="aot-order" title="Adventurers of Theolden Store" colums={1}>
        <NumberLabel>Amount</NumberLabel>
        {isIdle ? (
          <NumberInput
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0"
          />
        ) : (
          <NumberInput type="number" value={amount} disabled />
        )}
        <ActionSection amount={amount} status={status} />
      </Section>
    </AOTOrderContainer>
  );
};