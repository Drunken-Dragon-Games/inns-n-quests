import styled from "styled-components"
import { MessiriFontFamily } from "../common-css"

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
