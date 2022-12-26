import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getDragonSilver, getDragonSilverToClaim } from "../features/player"

export default () =>{

    const generalDispatch = useGeneralDispatch()
    useEffect(()=>{
        generalDispatch(getDragonSilver())
        generalDispatch(getDragonSilverToClaim())
    },[])
}