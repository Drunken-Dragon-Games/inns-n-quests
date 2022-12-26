import { useState, useEffect } from "react"

export default (artists: string []): string => {

    const [artistsText, setArtistsText] = useState<string>("")

    useEffect(() => {
        concatText()
    }, [artists])
    

    const concatText = () =>{

        let first = false;
        let concatText = ""

        artists.forEach(artist => {
            
            
            if(first == false){
                concatText = `${artist}`
                first = true
            } else{
                concatText = `${concatText} / ${artist}`
            }

        });
        setArtistsText(concatText)
    }

    return artistsText
}