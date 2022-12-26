import styled from "styled-components"
import { ConditionalRender } from "../../components/basic_components"
import Image from "next/image"
import { useGetAuthenticationIcon } from "../hooks"

const IconWrapper = styled.div`
    width: 3vw;
    height: 3vw;
    max-width: 76.8px;
    max-height: 76.8px;

    @media only screen and (max-width: 414px) {
        width: 6vw;
        height: 6vw;
    }
`


const AuthenticationMethodIcon = (): JSX.Element => {
    
    const authenticationMethod = useGetAuthenticationIcon()

    

    return(<>
        <ConditionalRender condition = {authenticationMethod == "Eternl"}>
            <IconWrapper>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/athenticated_method/eternl.svg" alt = "authentication method Icon" width={50}  height = {50} layout="responsive"/>
            </IconWrapper>
        </ConditionalRender>

        <ConditionalRender condition = {authenticationMethod == "Nami"}>
            <IconWrapper>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/athenticated_method/nami.svg" alt = "authentication method Icon" width={50}  height = {50} layout="responsive"/>
            </IconWrapper>
        </ConditionalRender>

        <ConditionalRender condition = {authenticationMethod == "Discord"}>
            <IconWrapper>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/athenticated_method/discord.svg" alt = "authentication method Icon" width={50}  height = {50} layout="responsive"/>
            </IconWrapper>
        </ConditionalRender>
        
    </>)
}

export default AuthenticationMethodIcon
