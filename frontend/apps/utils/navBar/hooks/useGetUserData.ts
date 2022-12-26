import { useEffect, useState, useRef } from "react"
import { hasCookie } from 'cookies-next';
import { userDataFetch } from "../features/userInfo";
import { useGeneralDispatch, useGeneralSelector } from "../../../../features/hooks"; 
import { selectGeneralReducer } from "../../../../features/generalReducer";

export default () : ("fulfilled" | "pending" | "rejected" | "idle") =>{


    const isCookie = hasCookie ("access")

    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const userDataStatus = generalSelector.userDataNavBar.status.status
    const [ isUserData, setIsUserData ] = useState<"fulfilled" | "pending" | "rejected" | "idle">(userDataStatus)
    const isFetched = useRef<boolean>(false)


    useEffect(() => {
        if(userDataStatus == "fulfilled"){
            setIsUserData(userDataStatus)
        } else if (userDataStatus == "rejected"){
            setIsUserData(userDataStatus)
        }
    }, [userDataStatus])

    useEffect(() => {

        if(isCookie == true && userDataStatus != "fulfilled" && isFetched.current == false){
            generalDispatch(userDataFetch())
            isFetched.current = true;
        }  
       
    }, [])


    useEffect(() => {

        if(isCookie == false){
            setIsUserData("rejected")
        }  
       
    }, [])

    return isUserData
}