import styled from "styled-components"
import { useState } from "react"
import Image from "next/image"
import { ConditionalRender } from "../../../../utils/components/basic_components"

const AdventuresButtonWrapper = styled.div`
    width: 7.5vw;
    height: 4.5vw;
    display: flex;   
`



interface ImageWrapperHover {

    hover: boolean
}
const ImageWrapper = styled.div<ImageWrapperHover>`
    width: ${props => props.hover ? "7.4" : "6.5"}vw;
    margin: auto;

    img{
        cursor: pointer;
    }
`

interface SmallButton{
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    srcNormal: string
    srcOnHover: string
}

const SmallButton = ({ onClick, srcNormal, srcOnHover} : SmallButton) =>{

   
    const [hover, setHover] = useState<boolean>(false)
    
    return <>
        <AdventuresButtonWrapper onClick={onClick as any} onMouseOver ={()=> setHover(true)} onMouseLeave ={ ()=> setHover(false) }>
            <ImageWrapper hover = {hover} >

                <ConditionalRender condition={hover == true}>
                    <Image src= {srcOnHover}  alt="punt image" width={2000} height={1250} priority layout = "responsive" />
                </ConditionalRender>

                <ConditionalRender condition={hover == false}>
                    <Image src= {srcNormal}  alt="punt image" width={2000} height={1250} priority layout = "responsive" />
                </ConditionalRender>
                
            </ImageWrapper>
        </AdventuresButtonWrapper>
    </>
}

export default SmallButton