import styled from "styled-components"
import { PixelArtImage, Units } from "../../../../../../common"

const CheckWrapper = styled.div`
    position: relative;
`

const CheckMarkWrapper = styled.div`
    position: absolute;
    top: 0;
`

const PixelCheckbox = ({ checked, size }: { checked: boolean, size: Units }) => {
    return (
        <CheckWrapper>
            <PixelArtImage 
                src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/checkbox.svg" 
                alt="drunken Dragon checkbox" 
                width={1} height={1} 
                units={size}
            />
            { checked &&
                <CheckMarkWrapper>
                    <PixelArtImage 
                        src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/check.svg" 
                        alt="drunken Dragon check" 
                        width={1} height={1} 
                        units={size}
                    />
                </CheckMarkWrapper>
            }

        </CheckWrapper>
    )
}

export default PixelCheckbox