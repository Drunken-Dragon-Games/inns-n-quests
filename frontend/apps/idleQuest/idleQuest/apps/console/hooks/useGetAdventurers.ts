import { useEffect } from "react"
import { useGeneralDispatch } from "../../../../../../features/hooks"
import { getAdventurers } from "../features/adventurers"

export default () => {

    const generalDispatch = useGeneralDispatch()

    useEffect(()=>{
        generalDispatch(getAdventurers())
    },[])
}