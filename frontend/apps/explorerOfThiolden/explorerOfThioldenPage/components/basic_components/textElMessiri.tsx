import styled from "styled-components"

const TextElMessiriStyle = styled.p<TextElMessiri>`
    font-family: El Messiri;
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

interface TextElMessiri{
    children: string | string [],
    fontsize: number,
    fontsizeMobile?: number,
    textAlignMobile?: "center" | "right" | "left",
    textAlign?: "center" | "right" | "left",
    color: string
    lineHeightMobil?: number
}

const TextElMessiri = ({children, fontsize, color, textAlign, fontsizeMobile, textAlignMobile, lineHeightMobil}: TextElMessiri) =>{
    
    return <TextElMessiriStyle 
                fontsize={fontsize} 
                color={color}  
                textAlign={textAlign}
                fontsizeMobile={fontsizeMobile}
                textAlignMobile={textAlignMobile}
                lineHeightMobil={lineHeightMobil}
            >{children}</TextElMessiriStyle>
        
}

export default TextElMessiri