import { useEffect } from "react"
import { useGeneralDispatch, useGeneralSelector } from "../../../../features/hooks"
import { selectGeneralReducer } from "../../../../features/generalReducer"

export default () =>{
    const userDataSelector = useGeneralSelector(selectGeneralReducer)
    const generalDispatch = useGeneralDispatch()

    const navbarDataStatus = userDataSelector.userDataNavBar.status.status
    const navbarDataError = userDataSelector.userDataNavBar.status.error

    useEffect(() => {
    

    }, [navbarDataStatus])
    
}