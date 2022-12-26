import styled from "styled-components"
import Image from "next/image"
import { useState } from "react"
import { ConditionalRender, PlayButton } from "."
import YouTube from 'react-youtube';


const PreviewImageWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
`
const VideoWrapper = styled.div`
    width: 100%;
    height: 100%;
    z-index: 0;
    div{
        width: 100% !important;
        height: 100% !important;

    }
    iframe{
        width: 100% !important;
        height: 100% !important;
    }
`

const PlayButtonWrapper = styled.div`
    position: absolute;
    top: 0vw;
    width: inherit;
    height: inherit;
    display: flex;
`

const Center = styled.div`
    margin: auto;
`

interface youtubeVideo{
    previewImage: string
    videoCode: string
}

const YoutubeVideo = ({previewImage, videoCode}: youtubeVideo) : JSX.Element => {

    const [click, setClick]  = useState<boolean>(false)

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 0,
        }
    }
    

    return (<>
            {/* <ConditionalRender condition = { click == false}>

                <PreviewImageWrapper onClick={() => setClick(true)}>
                    <Image src = {previewImage} alt = "preview drunken dragon" width = {80} height = {50} layout = "responsive" />
                    
                    <PlayButtonWrapper>
                        <Center>
                            <PlayButton/>
                        </Center>
                    </PlayButtonWrapper>

                </PreviewImageWrapper>
               
            </ConditionalRender> */}


            <VideoWrapper>
                <YouTube videoId = {videoCode} opts={opts}  />
            </VideoWrapper>
            
    </>)
}

export default YoutubeVideo