import styled from "styled-components"
import { DataUpdateLine } from "../basic_components"
import { useEffect } from "react"
import { setUserName } from "../../../../utils/navBar/features/userInfo"
import { useGeneralSelector, useGeneralDispatch } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"

const DataUpdateComponent = styled.div`
    width: 20vw;
    max-width: 512px;
    margin: auto auto auto auto;

    @media only screen and (max-width: 414px) {
        width: 60vw;
        margin-top: 5vw;
    }
`

interface DataUpdate {
    name: string
    nameIdentifier: number
}

const DataUpdate = ({ name,nameIdentifier }:DataUpdate): JSX.Element => {

    const generalDispatch = useGeneralDispatch()
    const generalSelector =  useGeneralSelector(selectGeneralReducer)

    const changeNickNameStatus = generalSelector.profileData.nickName.status.status
    const nickName = generalSelector.accountData.data.nickName


    useEffect(()=>{

        if(changeNickNameStatus == "fulfilled"){
            generalDispatch(setUserName(nickName))
        }
        
    },[changeNickNameStatus])
    


    return (<>
            <DataUpdateComponent>
                <DataUpdateLine title="Name" action = {() => console.log("name")}>{`${name} #${nameIdentifier}`}</DataUpdateLine>
            </DataUpdateComponent>
    </>)
}

export default DataUpdate