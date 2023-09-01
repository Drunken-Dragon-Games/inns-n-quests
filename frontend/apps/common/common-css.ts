import { css } from "styled-components"

export const colors = {
    alertBackground:   "rgb(22, 11, 11)",
    alertText:         "rgb(244, 199, 199)",
    infoBackground:    "#0B1015",
    infoText:          "white",
    successBackground: "rgb(12, 19, 13)",
    successText:       "rgb(204, 232, 205)",
    successHigthlight: "rgb(102, 176, 105)",
    textGray:          "rgb(74, 83, 98)",
    textBeige:         "#CAC6BE",
    dduBackground:     "#0B1015",
    dduBrackground2:   "rgb(20, 33, 44)",
    dduGold:           "#ca9f44",
}

export const AlertScheme = css`
    background-color: ${colors.alertBackground};
    color: ${colors.alertText};
`

export const InfoScheme = css`
    background-color: ${colors.infoBackground};
    color: ${colors.infoText};
`

export const SuccessScheme = css`
    background-color: ${colors.successBackground};
    color: ${colors.successText};
`

export const fontFamilies = {
    sansSerif: "Roboto, sans-serif",
    mesiri: "El Messiri, sans-serif",
    oswald: "Oswald, sans-serif",
    pixel:  "VT323, monospace"
}

export const SansSerifFontFamily = css`
    font-family: ${fontFamilies.sansSerif};
`

export const MessiriFontFamily = css`
    font-family: ${fontFamilies.mesiri};
`

export const PixelFontFamily = css`
    font-family: ${fontFamilies.pixel};
`

export const OswaldFontFamily = css`
    font-family: ${fontFamilies.oswald};
`

export const Unselectable = css`
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`