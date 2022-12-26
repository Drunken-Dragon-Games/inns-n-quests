import Image from "next/image"
import styled from "styled-components"

const RoadMapSectionBackgroundComponent = styled.div`
    width: inherit;
    height: inherit;
    max-width: inherit;
    display: flex;
    position: relative;

    @media only screen and (max-width: 414px) {
        display: none;
    }
`

const Logo = styled.div`
    width: 20vw;
    height: 20vw;
    margin: auto;
    max-height: 512px;
    max-width: 512px;
`

const RightCorner = styled.div`
    position: absolute;
    right: 10vw;
    top: 6vw;
    width: 15vw;
    height: 15vw;

    @media only screen and (min-width: 2560px) {
        right: 0vw;
    }
`

const LeftCorner = styled.div`
    position: absolute;
    left: 0vw;
    top: 25vw;
    width: 20vw;
    height: 20vw;
    transform: rotate(180deg);
`

const RoadMapSectionBackground = (): JSX.Element => {
    return (<>
                <RoadMapSectionBackgroundComponent>
                    
                    <Logo>
                        <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/drunken_dragon_logo.svg" width={50} height={50} layout ="responsive" /> 
                    </Logo>

                    <RightCorner>
                        <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/left_corner_rm.svg" width={50} height={50} layout ="responsive" /> 
                    </RightCorner>

                    <LeftCorner>
                        <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/home/right_corner_rm.svg" width={50} height={50} layout ="responsive" /> 
                    </LeftCorner>
                </RoadMapSectionBackgroundComponent>
    </>)
}

export default RoadMapSectionBackground