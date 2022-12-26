import styled from "styled-components";
import Image from "next/image";

const ImgWrapper = styled.div`
    width: 100%;
    margin-left:-4.4vw;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;  
`


interface scalingImageDate{
    src: string,
}


const RescalingProgression  = ({src} : scalingImageDate) => {

    return <>
        <ImgWrapper>
            <Image 
                src= {src}  
                alt="chest" 
                width={1050} 
                height={200}
                layout = "responsive"  />
        </ImgWrapper>
    </>
}

export default RescalingProgression