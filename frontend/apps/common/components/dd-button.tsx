import styled from "styled-components"
import { colors, MessiriFontFamily } from "../common-css"

export const DDButton = styled.button`
    ${MessiriFontFamily}
    cursor: pointer;
    border: none;
    background-color: transparent;
    color: white;
    background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/button/button.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 150px;
    height: 40px;
    font-size: 14px;

    &:hover {
        background-image: url("https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/button/button_hover.svg");
    }
`

export const SimpleDDButton = styled.button`
    ${MessiriFontFamily}
    cursor: pointer;
    border: 1px solid ${colors.dduGold};
    border-radius: 3px;
    background-color: ${colors.dduBackground};
    color: white;
    padding: 5px 10px;
    font-weight: bold;

    &:hover {
        border: 1px solid white;
    }
`

interface ScalableSimpleButtonProps {
    height?: string;
    width?: string;
    fontSize?: string;
  }

export const ScalableSimpleButton = styled.button<ScalableSimpleButtonProps>`
  ${MessiriFontFamily}
  cursor: pointer;
  border: 1px solid ${colors.dduGold};
  border-radius: 3px;
  background-color: ${colors.dduBackground};
  color: white;
  padding: 5px 10px;
  font-weight: bold;
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  font-size: ${(props) => props.fontSize || 'inherit'};

  &:hover {
    border: 1px solid white;
  }
`;