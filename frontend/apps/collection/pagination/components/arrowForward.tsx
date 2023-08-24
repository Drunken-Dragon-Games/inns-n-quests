import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";

interface ArrowComponentProps {
    clickAble: boolean;
}

const ArrowComponent = styled.div<ArrowComponentProps>`
    position: relative;
    cursor: ${props => props.clickAble ? "pointer" : "not-allowed"};
`;

interface ArrowImageProps {
    clickAble: boolean;
}

const ArrowImage = styled.div<ArrowImageProps>`
    width: 2.099vw;
    height: 1.949vw;
    position: absolute;
    z-index: 2;
    filter: ${props => props.clickAble ? "none" : "grayscale(100%)"};

    @media only screen and (max-width: 414px) {
        width: 10.099vw;
        height: 9.949vw;
    }
`;

interface ArrowOnHoverProps {
    hover: boolean;
}

const ArrowOnHover = styled.div<ArrowOnHoverProps>`
    width: 2.203vw;
    height: 2.053vw;
    position: absolute;
    z-index: 1;
    top: -0.1vw;
    opacity: ${props => props.hover ? "1" : "0"};
    transition: opacity 0.2s;

    @media only screen and (max-width: 414px) {
        width: 10.203vw;
        height: 9.053vw;
    }
`;

interface ArrowForwardProps {
    onClick: () => void;
    clickAble: boolean;
}

export const ArrowForward = ({ onClick, clickAble }: ArrowForwardProps) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <ArrowComponent 
            onMouseLeave={() => clickAble && setHover(false)}
            onMouseOver={() => clickAble && setHover(true)}
            onClick={onClick}
            clickAble={clickAble}
        >
            <ArrowImage clickAble={clickAble}>
                <Image 
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/arrows/forward.svg"
                    alt="arrow forward drunken dragon"
                    layout="responsive"
                    width={40.3}
                    height={37.42}
                    priority
                />
            </ArrowImage>
            <ArrowOnHover hover={hover}>
                <Image 
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/arrows/forward_onhover.png"
                    alt="arrow forward drunken dragon"
                    layout="responsive"
                    width={42.3}
                    height={39.42}
                />
            </ArrowOnHover>
        </ArrowComponent>
    );
};
