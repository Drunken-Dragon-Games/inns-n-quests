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

    @media only screen and (min-width: 2560px) {
        font-size: ${props => (props.fontsize* 2560) / 100}px;
    }
`

interface TextElMessiri{
    children: string | string [] | number,
    fontsize: number,
    fontsizeMobile?: number,
    textAlignMobile?: "center" | "right" | "left",
    textAlign?: "center" | "right" | "left",
    color: string
    lineHeightMobil?: number
}

const TitleElMessiri = ({children, fontsize, color, textAlign, fontsizeMobile, textAlignMobile, lineHeightMobil}: TextElMessiri): JSX.Element =>{
    
    return <TextElMessiriStyle 
                fontsize={fontsize} 
                color={color}  
                textAlign={textAlign}
                fontsizeMobile={fontsizeMobile}
                textAlignMobile={textAlignMobile}
                lineHeightMobil={lineHeightMobil}
            >{children}</TextElMessiriStyle>
        
}

export default TitleElMessiri