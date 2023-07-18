import { Units, vmax1 } from "../units"
import styled from 'styled-components';
import { HTMLAttributes } from 'react';

interface VideoStylingProps {
    height?: number,
    width?: number,
    units: Units,
    max?: Units
}

export interface VideoProps extends HTMLAttributes<HTMLVideoElement>, VideoStylingProps {
    src: string,
    alt?: string,
    autoplay?: boolean,
    loop?: boolean,
    muted?: boolean,
}

const StyledVideo = styled.video<VideoStylingProps>`
    ${props => props.height ? `height: ${props.units.u(props.height)};` : ""}
    ${props => props.width ? `width: ${props.units.u(props.width)};` : ""}
    ${props => props.max ? `max-width: ${props.max.u(props.width)};` : ""}
    ${props => props.max ? `max-height: ${props.max.u(props.height)};` : ""}
`;

export const Video = ({
    src,
    alt,
    autoplay = true,
    loop = true,
    muted = true,
    height,
    width,
    units = vmax1,
    max,
    ...rest
}: VideoProps) => {
    return (
        <StyledVideo 
            {...rest}
            height={height}
            width={width}
            units={units}
            max={max}
            src={src} 
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
        >
            {alt && <p>{alt}</p>}
            Your browser does not support the video tag.
        </StyledVideo>
    )
}
