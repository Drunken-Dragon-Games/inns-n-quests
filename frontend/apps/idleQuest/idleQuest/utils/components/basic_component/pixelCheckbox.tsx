import Image from "next/image"
import styled from "styled-components"

const CheckWrapper = styled.div`
    width: 1vw;
    height: 1vw;
    position: relative;

    img{
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges; 
    }
`

const CheckMarkWrapper = styled.div`
    position: absolute;
    top: 0vw;

    img{
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges; 
    }
`


interface pixelCheckbox {
    isChecked: boolean
}

const PixelCheckbox = ({isChecked} : pixelCheckbox) => {
    return (<>
            <CheckWrapper>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/checkbox.svg" alt="drunken Dragon checkbox" width={1000} height={1000} />
                {isChecked == true
                    ?
                        <CheckMarkWrapper>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/check.svg" alt="drunken Dragon check" width={1000} height={1000} />
                        </CheckMarkWrapper>
                    : null}
              
            </CheckWrapper>
    </>)
}

export default PixelCheckbox