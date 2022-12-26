import { useRouter } from 'next/router'
import { useEffect } from "react"
import { compareNonceAddDiscord } from "../features/addDiscord" 
import { useRedirect } from "../../../utils/hooks"
import { useGeneralSelector, useGeneralDispatch } from "../../../../features/hooks"
import { selectGeneralReducer } from "../../../../features/generalReducer"

export default () => {
    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const compareNonceStatus = generalSelector.addDiscord.status.compareNonce.status
    const connectDiscord = generalSelector.addDiscord.status.connectDiscord.status

    
    const router = useRouter()
    const [redirectPath, redirectUrl] = useRedirect()


    useEffect(()=>{

        if(router.query.state !== undefined && router.query.code !== undefined){
            generalDispatch(compareNonceAddDiscord((router.query.state as string), (router.query.code as string)))
        }

    },[router])


    useEffect(() =>{
        if(compareNonceStatus == "rejected" || connectDiscord == "rejected"){
            redirectPath("/accountsettings")
        } else if (connectDiscord == "fulfilled"){
            redirectPath("/accountsettings")
        }
    },[connectDiscord, compareNonceStatus])
}