import styled from "styled-components"

const OswaldStyle = styled.p<TextOswald>`
    font-family: Oswald;
    font-size: ${props => props.fontsize}vw;
    color ${props => props.color};
    text-align: ${props => props.textAlign != undefined ? props.textAlign : "left" };
    line-height:  ${props => props.fontsize + 0.2}vw;
    &:first-letter{
        text-transform: uppercase; 
    }
    @media only screen and (max-width: 414px) {
        font-size: ${props => props.fontsizeMobile}vw;
        text-align: ${props => props.textAlignMobile};
        line-height:  ${props => props.lineHeightMobil ? props.lineHeightMobil  + 0.2 : ""}vw;
        color:  ${props => props.colorMobile ? props.colorMobile : props.color}
    }

    @media only screen and (min-width: 2560px) {
        font-size: ${props => (props.fontsize* 2560) / 100}px;
    }
`

interface TextOswald{
    children: string | (JSX.Element | string) [] | number| JSX.Element 
    fontsize: number,
    fontsizeMobile?: number,
    textAlignMobile?: "center" | "right" | "left",
    textAlign?: "center" | "right" | "left",
    color: string
    lineHeightMobil?: number
    colorMobile?: string
}

const TextOswald = ({children, fontsize, color, textAlign, fontsizeMobile, textAlignMobile, lineHeightMobil, colorMobile}: TextOswald): JSX.Element =>{
    
    return <OswaldStyle 
                fontsize={fontsize} 
                color={color}  
                textAlign={textAlign}
                fontsizeMobile={fontsizeMobile}
                textAlignMobile={textAlignMobile}
                lineHeightMobil={lineHeightMobil}
                colorMobile={colorMobile}
            >{children}</OswaldStyle>
        
}

export default TextOswald