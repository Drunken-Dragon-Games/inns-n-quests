import { RoadMapSectionBackground } from "../basic_components"
import styled from "styled-components"
import { TitleElMessiri } from "../../../../utils/components/basic_components"
import { roadMap } from "../../../../../setting"
import { RoadMapQ } from "../basic_components"

const RoadMapSectionWrapper = styled.section`
    margin: 5vw 0vw;
    padding: 0vw 5.438vw;
    display: flex;
    
    width: 100vw;

    @media only screen and (max-width: 414px) {
        display: block;
        padding: 0vw;
        margin: 15vw 0vw;
    }

    @media only screen and (min-width: 2560px) {
        padding:  0vw;
    }
`

const PositionRelative = styled.div`
    position: relative;
    display: flex;
    margin: auto;
    width: 100vw;
    max-width: 2000px;

    @media only screen and (max-width: 414px) {
        display: block;
    }
`

const Title = styled.div`
    position: absolute;
    width: 25vw;
    max-width: 640px;
    right: 1vw;

    @media only screen and (max-width: 414px) {
        position: static;
        width: 100vw;
        padding: 0vw 3vw;
        margin-bottom: 2vw;
    }
`

const RoadMapWOne = styled.div`

    @media only screen and (max-width: 414px) {
       padding: 0vw 7vw;
       position: relative;
    }

    @media only screen and (min-width: 2560px) {
        width: 25vw;
        max-width: 500px;
    }
`

const RoadMapTwo = styled.div`
    margin-top: 8vw;
    
    @media only screen and (max-width: 414px) {
        margin-top: 10vw;
        padding: 0vw 7vw;
        position: relative;
    }

    @media only screen and (min-width: 2560px) {
        width: 25vw;
        max-width: 500px;
    }
`

const RoadMapThree = styled.div`
    margin-top: 16vw;

    @media only screen and (max-width: 414px) {
        margin-top: 10vw;
        padding: 0vw 7vw;
        position: relative;
    }

    @media only screen and (min-width: 2560px) {
        width: 25vw;
        max-width: 500px;
    }
`

const RoadMapFour = styled.div`
    margin-top: 24vw;

    @media only screen and (max-width: 414px) {
        margin-top: 10vw;
        padding: 0vw 7vw;
        position: relative;
    }
`

const BackgroundPosition = styled.div`
    position: absolute;
    width: inherit;
    height: inherit;
    max-width: 2000px;
    z-index: 0;

    @media only screen and (max-width: 414px) {
        position: relative;
        width: 100vw;
        height: 5vw;
    }
`



const RoadMapSection = (): JSX.Element => {
    return (<>
            <RoadMapSectionWrapper>
                <PositionRelative>

                    <Title><TitleElMessiri fontsize = {2.5} color="white" fontsizeMobile={7} lineHeightMobil={7} textAlignMobile="center">DRUNKEN DRAGON ROADMAP</TitleElMessiri></Title>

                    <BackgroundPosition>
                        <RoadMapSectionBackground/>
                    </BackgroundPosition>

                    {roadMap.map((el, index) =>{
                        if(index == 0){
                            return (
                            <RoadMapWOne key ={el.title}>
                                <RoadMapQ data ={el.bullets} title ={el.title}/>
                            </RoadMapWOne>
                        )
                        } else if (index == 1){
                            return (
                                <RoadMapTwo key ={el.title}>
                                    <RoadMapQ data ={el.bullets} title ={el.title}/>
                                </RoadMapTwo>
                            )

                        } else if (index == 2){
                            return (
                                <RoadMapThree key ={el.title}>
                                    <RoadMapQ data ={el.bullets} title ={el.title}/>
                                </RoadMapThree>
                            )
                            
                        } else if (index == 3){
                            return (
                                <RoadMapFour key ={el.title}>
                                    <RoadMapQ data ={el.bullets} title ={el.title}/>
                                </RoadMapFour>
                            )
                            
                        } 
                    })}

                </PositionRelative>
            </RoadMapSectionWrapper>
        
    </>)
}

export default RoadMapSection