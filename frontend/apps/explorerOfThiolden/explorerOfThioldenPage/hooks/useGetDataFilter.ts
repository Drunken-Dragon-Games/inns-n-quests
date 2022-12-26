import { useGeneralDispatch, useGeneralSelector } from "../../../../features/hooks";
import { selectGeneralReducer } from "../../../../features/generalReducer"; 
import { useEffect } from "react";
import { setFilteredData } from "../features/explorerOfThiolden";



export default () =>{

    const generalDispatch = useGeneralDispatch()

    const generalSelector = useGeneralSelector(selectGeneralReducer)

    const filter = generalSelector.exploreOfThioldenReducer.data.filter

    useEffect(() => {
        generalDispatch(setFilteredData())
    }, [filter])

}