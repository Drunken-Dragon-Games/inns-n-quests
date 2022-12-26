import styled from "styled-components"
import Image from "next/image"

const LogoWrapper = styled.div`
    width: 11.003vw;
    height: 3.856vw;
    max-width: 211.258px;
    max-height: 74.035px;
`

const Logo = () : JSX.Element =>{
    return (<>
            <LogoWrapper>
                <Image 
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/drunken_logo.svg" 
                    layout="responsive" 
                    alt="drunken dragon logo grey version ddu app" 
                    width={211.25} 
                    height={74.04}
                />
            </LogoWrapper>
        
    </>)
}

export default Logo