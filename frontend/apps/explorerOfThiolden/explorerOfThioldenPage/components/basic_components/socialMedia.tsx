import { TextElMessiri } from "."
import styled from "styled-components"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { socialMedia } from  "../../../../../setting"


interface SocialMediaIconWrapper {
    hover: boolean
}
const SocialMediaIconWrapper = styled.div<SocialMediaIconWrapper>`

    width: ${ props => props.hover ? "1.3" :  "1.2"}vw;
    height: ${ props => props.hover ? "1.3" :  "1.2"}vw;
    margin: auto;
    transition: width 0.1s, height 0.1s;
`

interface socialMediaElement{
    name: string
    url: string
}

interface socialMediaIcon{
    element: socialMediaElement
}
const SocialMediaIcon = ({element}: socialMediaIcon) =>{
    
    const [ hover, setHover] = useState<boolean>(false)
    
    return(<>
        <SocialMediaIconWrapper onMouseOver={ () => setHover(true)} onMouseLeave = { () =>  setHover(false)} hover = {hover}>
            <Link href={element.url} passHref={true}>
                <a target="_blank">
                    <Image src= {hover == false ? `https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/social_media/${element.name}.svg` :  `https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/social_media/${element.name}_hover.svg` }  alt="social media icon" width={100} height={100} priority layout = "responsive"/>
                </a>
            </Link>
        </SocialMediaIconWrapper>
    </>)
}


const SocialMediaWrapper = styled.div`
    width: inherit;
    z-index: 11;
`

const SocialMediaIconWrapperFlex = styled.div`
    width: 2vw;
    height: 1.5vw;
    display: flex;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: 2vw 2vw;
`

const SocialMedia = () => {
    return (<>
        <SocialMediaWrapper>
            <TextElMessiri 
                color="#C0BAB1" 
                fontsize={1} 
                textAlign="center"
            >Join Us</TextElMessiri>
            <Grid>
                {socialMedia.map(el => {
                    return(
                        <SocialMediaIconWrapperFlex key = {el.name}>
                            <SocialMediaIcon element={el}/>
                        </SocialMediaIconWrapperFlex>
                    )

                })}
            </Grid>

            
            
        </SocialMediaWrapper>
    </>)
}

export default SocialMedia