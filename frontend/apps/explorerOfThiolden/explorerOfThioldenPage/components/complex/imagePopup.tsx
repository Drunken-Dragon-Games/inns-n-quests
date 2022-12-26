import { ShadowWrapper } from "../basic_components"
import { setPage } from "../../features/explorerOfThiolden"
import Image from "next/image"
import { useGeneralDispatch, useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"
import { useBlockScreen } from "../../../../utils/hooks"


interface AllCharacterChart {
   width: number
   height: number
   name: "roster" | "rarity_chart"
   imgSrc: string
}

const ImagePopup = ({width, height, name, imgSrc }:AllCharacterChart ): JSX.Element => {

    const generalDispatch = useGeneralDispatch()

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const banner = generalSelector.exploreOfThioldenReducer.banner.bannerName

    console.log(banner);

    console.log(name);
    
    useBlockScreen( banner == name )

    return (<>
         <ShadowWrapper isActive ={banner == name} clickOutsideAction={()=> generalDispatch(setPage("none"))} width={width} height={height}>
            <Image 
                src = {imgSrc}
                alt = "card drunken dragon"   
                layout = "responsive" 
                width={width} 
                height={height}
            />
        </ShadowWrapper>
    </>)
}

export default ImagePopup