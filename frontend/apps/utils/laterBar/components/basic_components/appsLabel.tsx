import styled from "styled-components"
import { useState } from "react"
import { TextOswald, LinkDisable, ConditionalRender } from "../../../components/basic_components"
import Image from "next/image"
import { colors, OswaldFontFamily } from "../../../../common"

interface AppLabelWrapper {
    disable?: boolean 
}

const AppLabelWrapper = styled.div<AppLabelWrapper>`
    display: inline-block;
    height: 1.3vw;
    max-height: 33.28px; 

    ${ props => props.disable ? "filter: grayscale(100%);" : ""}

`

const Flex = styled.div`
    display: flex;
`

interface IconWrapper {
    disablePointer?: boolean 
}

const IconWrapper = styled.div<IconWrapper>`
    width: 1.3vw;
    max-width: 33.28px; 
    height: inherit;
    margin-right: 1.8vw;
    position: relative;
    cursor: ${ props => props.disablePointer ? "": "pointer"};

    @media only screen and (max-width: 414px) {
        width: 6vw;
        margin-right: 3vw;
    }
`

interface TextWrapper {
    disablePointer?: boolean 
}

const TextWrapper = styled.div<TextWrapper>`
    margin: auto 0vw;  
    height: inherit; 
    cursor: ${ props => props.disablePointer ? "": "pointer"};
`

const Reflex = styled.div`
    display: flex;
    transform: rotatex(180deg) translatey(15px);
    margin-top: 0.7vw;
    filter: blur(9px) brightness(1.5);
    position: absolute;

    @media only screen and (max-width: 414px) {
        margin-top: 3vw;
    }
`

interface hover {
    hover: boolean
}

const IconWrapperHover = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
`

const IconWrapperRegular = styled.div<hover>`
    width: inherit;
    height: inherit;
    position: absolute;
    visibility: ${props => props.hover ? "hidden" : "visibility"};
`
const TooltipWrapper = styled.div`
  position: fixed;
  left: 80px;
  color: white;
  background-color: ${colors.textGray};
  ${OswaldFontFamily};
  padding: 8px;
  border-radius: 4px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 9999;
`;

interface appsLabel{
    url: string
    children: string
    app: string
    active: boolean
    disable?: boolean
    hoverMessage?: string
}

const AppsLabel = ( {url, children, app, active, disable, hoverMessage } : appsLabel ) : JSX.Element => {

    const [hover, setHover] = useState<boolean>(false)
    

    return (<>

        {hover && hoverMessage ? <TooltipWrapper style={{ visibility: 'visible', opacity: 1 }}>
            {hoverMessage}
        </TooltipWrapper> : <></>}
        <AppLabelWrapper disable = {disable}>
        
            <LinkDisable url={url} disable = {disable}>
                <Flex>
                    <IconWrapper onMouseOver= { () => setHover(true) } onMouseLeave={ () => setHover(false) } disablePointer ={disable}> 

                        <IconWrapperHover hover={(hover || active) && (disable != true)}>
                            <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar/sections/${app}_hover.svg`} layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                        </IconWrapperHover>

                        <IconWrapperRegular hover={(hover || active) && (disable != true)}>
                            <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar/sections/${app}.svg`} layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                        </IconWrapperRegular>
                        
                    </IconWrapper>

                    <TextWrapper onMouseOver= { () => setHover(true) } onMouseLeave={ () => setHover(false) } disablePointer ={disable}>
                        <TextOswald
                            fontsize={0.938}
                            color = { (hover || active) && disable != true ? "#ffffff" : "#CA9F44" }
                            fontsizeMobile ={4}
                            lineHeightMobil = {5}
                        > {children} </TextOswald>
                    </TextWrapper>
                </Flex>
            </LinkDisable>


            <ConditionalRender condition = {active}>
                
                    <Reflex>
                        <IconWrapper disablePointer ={true}> 
                            <Image src = {`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar/sections/${app}_hover.svg`} layout="responsive" width={50} height={50} alt = "app icon drunken dragon"/>
                        </IconWrapper>

                        <TextWrapper disablePointer ={true}>
                            <TextOswald
                                fontsize={0.938}
                                color = "#ffffff" 
                                fontsizeMobile ={4}
                                lineHeightMobil = {5}
                            > {children} </TextOswald>
                        </TextWrapper>
                    </Reflex>

            </ConditionalRender>

        </AppLabelWrapper>
        
            
    </>)
}

export default AppsLabel