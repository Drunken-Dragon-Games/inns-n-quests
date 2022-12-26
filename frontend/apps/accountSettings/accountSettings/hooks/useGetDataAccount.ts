import { useEffect, useState, useRef } from "react"
import { hasCookie } from 'cookies-next';
import { fetchAccountData } from "../features/accountData";
import {  useGeneralDispatch, useGeneralSelector } from "../../../../features/hooks";
import { selectGeneralReducer } from "../../../../features/generalReducer";

export default (): ("fulfilled" | "pending" | "rejected" | "idle") => {
    const isCookie = hasCookie ("access")
    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const AccountDataStatus = generalSelector.accountData.status.status
    const [ isAccountData, setIsAccountData ] = useState<"fulfilled" | "pending" | "rejected" | "idle">(AccountDataStatus)
    const isFetched = useRef<boolean>(false)

    
    useEffect(() => {
        
            setIsAccountData(AccountDataStatus)
    
    }, [AccountDataStatus])

    useEffect(() => {

        if(isCookie == true && AccountDataStatus != "fulfilled" && isFetched.current == false){
            generalDispatch(fetchAccountData())
            isFetched.current = true;
        }  
       
    }, [])

    useEffect(() => {

        if(isCookie == false){
            setIsAccountData("rejected")
        }  
       
    }, [])

    return isAccountData

}