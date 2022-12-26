import styled from "styled-components";
import Image from "next/image";

const ImgWrapper = styled.div`
    width: 100%;
    height: 100%;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`



interface scalingImageDate{
    src: string
}


const RescalingMonster  = ({ src } : scalingImageDate) => {


    return <>
           <ImgWrapper>
                <Image 
                    src= {src}  
                    alt="monster" 
                    width={1000} 
                    height={1850}
                    layout = "responsive"  
                />
            </ImgWrapper>
    </>
}

export default RescalingMonster