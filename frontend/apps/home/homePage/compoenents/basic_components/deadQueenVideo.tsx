import styled from "styled-components"
import Image from "next/image"
import { TextElMessiri, YoutubeVideo } from "../../../../utils/components/basic_components"


const DeadQueenContentWrapper = styled.div`
    width: 65%;
    position: relative;
    top: 4.167vw;
    height: inherit;
    margin: auto;

    @media only screen and (max-width: 414px) {
        width: 100%;
    }
`
const DeadQueenTextWrapper = styled.div`
    position: absolute;
    bottom: 12vw;
    left: 37vw;

    @media only screen and (max-width: 414px) {
        position: relative;
        width: 100%;
        z-index: 4;
        left: 0;
        top: -10vw;
    }

    
    @media only screen and (min-width: 2560px) {
        bottom: 200px;
        left: 1000px;
    }
`

const DeadQueenVideoWrapper = styled.div`
    cursor: pointer;
    border-radius: 0 0 2.604vw 2.604vw;
    overflow: hidden;
    height: 30.5vw;
    max-height: 780.8px;
    width: 100%;
    z-index: 5;
    position: absolute;

    @media only screen and (max-width: 414px) {
        width: 86%;
        left: 50.5%;
        transform: translateX(-50%);
        height: 46.5vw;
        border-radius: 2.604vw 2.604vw 2.604vw 2.604vw;
    }
`

const DeadQueenOutlineWrapper = styled.div`
    position: absolute;
    top: -1.5vw;
    width: 60vw;
    max-width: 1536px;
    left: 50.5%;
    transform: translateX(-50%);
    z-index: 0;

    @media only screen and (max-width: 414px) {
        width: 100%;
    }
`

const DeadQueenShieldWrapper = styled.div`
    position: absolute;
    width: 28.646vw;
    max-width: 733.338px;
    top: -7vw;
    left: -16vw;
`

const DeadQueenVideo = ():JSX.Element => {
    return (
        <>
    
            <DeadQueenContentWrapper>

                <DeadQueenShieldWrapper>
                    <Image
                        src={"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/dead-queen-shield.svg"}
                        width={1}
                        height={2}
                        layout="responsive"
                    />
                </DeadQueenShieldWrapper>

                <DeadQueenOutlineWrapper>        
                    <Image
                        src={"https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/dead-queen-outline.svg"}
                        width={1739}
                        height={969}
                        layout="responsive"
                    />
                </DeadQueenOutlineWrapper>

                <DeadQueenVideoWrapper>
                    <YoutubeVideo videoCode ="jlRGbOXhFUg"  previewImage ="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/dead-queens.png"/>
                </DeadQueenVideoWrapper>

                

            </DeadQueenContentWrapper>

            <DeadQueenTextWrapper>
                <TextElMessiri fontsize={1.875} color="#CAC6BE" textAlign="center" fontsizeMobile={5.5} textAlignMobile="center" lineHeightMobil={6.5}>This is where the legend begins!</TextElMessiri>
            </DeadQueenTextWrapper>
    
        </>
    )}

export default DeadQueenVideo