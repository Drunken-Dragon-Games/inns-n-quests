import styled from "styled-components"
import Link from "next/link"
import { TextElMessiri } from "."
import { artist } from "../../settings"


const SlashMobile = styled.div`
    display: block;
    @media only screen and (max-width: 414px) {
        display: none;
    }

`
interface artist {
    "@f3rraz" : string,
    "@killerkun": string,
    "@mayteesk": string,
    "@lukegger": string,
    "@limakiki.art": string,
    "@bunny": string,
    "@saphst4r": string,
    "@david": string
    "@enkian": string 
    "@killekun": string
    "@Ale_J_Andro" : string
    f3rraz : string
}

const ArtistWrapper = styled.div`
    display: flex;
    @media only screen and (max-width: 414px) {
        margin-top: 1.5vw;
    }
`


interface Artist{
    name: string
    index: number
}

const Artist = ({name, index}: Artist) =>{

    const url = artist[(name  as keyof artist)]

    
    
    return (<>
        <ArtistWrapper>
            {index > 0 ? <SlashMobile> <TextElMessiri fontsize={0.8} textAlign ="center" color="#C58E31" fontsizeMobile={3.5} lineHeightMobil ={3.7}>{` / `}</TextElMessiri></SlashMobile>: null}
            <Link href={url} passHref={true}>
                <a target="_blank">
                    <TextElMessiri fontsize={0.8} textAlign ="center" color="#C58E31" fontsizeMobile={3.5} lineHeightMobil ={3.7}>{name}</TextElMessiri>
                </a>
           </Link>
        </ArtistWrapper>
    </>)
}

export default Artist