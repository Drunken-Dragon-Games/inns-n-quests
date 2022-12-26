import styled from "styled-components"

const TextOswaldStyle = styled.p<TextOswald>`
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
    }
`

interface TextOswald{
    children: string | string [],
    fontsize: number,
    fontsizeMobile?: number,
    textAlignMobile?: "center" | "right" | "left",
    textAlign?: "center" | "right" | "left",
    color: string
    lineHeightMobil?: number
}

const TextOswald = ({children, fontsize, color, textAlign, fontsizeMobile, textAlignMobile, lineHeightMobil}: TextOswald) =>{
    
    return <TextOswaldStyle 
                fontsize={fontsize} 
                color={color}  
                textAlign={textAlign}
                fontsizeMobile={fontsizeMobile}
                textAlignMobile={textAlignMobile}
                lineHeightMobil={lineHeightMobil}
            >{children}</TextOswaldStyle>
        
}

export default TextOswald