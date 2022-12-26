import { Loading } from "../utils/components/basic_components";
import styled from "styled-components";
import { TitleElMessiri } from "../utils/components/basic_components"
import { useDiscordValidate } from "./hooks";

const ValidateBackground = styled.section`
    width: 100vw;
    height: 100vh;
    background-color: #0B1015;
    background-image: url("/login/texture.svg");
    display: flex;
`

const Center = styled.div`
    margin: auto;
`

const Text = styled.div`
    margin-top: 2vw;
    width: 15vw;

    @media only screen and (max-width: 414px) {
        margin-top: 5vw;
        width: 35vw;
    }
`



const Validate = (): JSX.Element =>{

    useDiscordValidate();


    return (<>
            <ValidateBackground>

                <Center>
                    <Loading size={12}/>
                    <Text>
                        <TitleElMessiri fontsize={2} color="#fff" textAlign="center" fontsizeMobile={5} lineHeightMobil ={6}> You are being redirected</TitleElMessiri>    
                    </Text>
                </Center>

            </ValidateBackground>
    </>)
}

export default Validate