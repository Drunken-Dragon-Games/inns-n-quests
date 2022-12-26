import { TextOswald } from "../../../../utils/components/basic_components"
import styled from "styled-components"
import { InteractButton, ShadowWrapper, ConditionalRender  } from "../../../../utils/components/basic_components"
import { InputTextPopUp } from "../../../../utils/components/complex"
import { useState } from "react"
import { fetchPostNickName } from "../../features/changeProfileData"
import { useGeneralDispatch } from "../../../../../features/hooks"


const DataUpdateLineComponent = styled.div`
    display: flex;
    width: 100%;
`

const MarginRight = styled.div`
    margin-right: 1vw;
`

const InteractButtonWrapper = styled.div`
    margin-top: 0.3vw;
    margin-left: auto;
    @media only screen and (max-width: 414px) {
        margin-top: 1vw;
    }
`

interface dataUpdateLine {
    title: string
    children: string
    action: () => void
}

const DataUpdateLine = ({title, children, action } : dataUpdateLine ): JSX.Element => {


    const [ changeName, setChangeName ] = useState<boolean>(false)

    const generalDispatch = useGeneralDispatch()

    return (<>
            <DataUpdateLineComponent>
                <MarginRight>
                    <TextOswald fontsize={0.9} color = "#CAC6BE" fontsizeMobile={4} lineHeightMobil = {4}>
                        {title}
                    </TextOswald>
                </MarginRight>
                
                <MarginRight>
                    <TextOswald fontsize={0.9} color = "white" fontsizeMobile={4} lineHeightMobil = {4}>
                        {children}
                    </TextOswald>
                </MarginRight>
               
                <InteractButtonWrapper>
                    <InteractButton action = {() => setChangeName(true)}/>
                </InteractButtonWrapper>
                
            </DataUpdateLineComponent>

            <ConditionalRender condition = {changeName}>
                <ShadowWrapper>
                    <InputTextPopUp 
                        title="New Name" 
                        action={(name) => {generalDispatch(fetchPostNickName(name)); setChangeName(false)}} 
                        back = {() => setChangeName(false)} 
                        placeHolder="ex. Bearius"
                    />
                </ShadowWrapper>
            </ConditionalRender>

           
    </>)
}

export default DataUpdateLine