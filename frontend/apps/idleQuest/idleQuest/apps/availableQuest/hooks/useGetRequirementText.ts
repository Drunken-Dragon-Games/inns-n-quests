import { useEffect, useState } from "react"
import { RequirementType } from "../../../../../../types/idleQuest"




export default (requirements:RequirementType): string => {

    const [text, setText] = useState<string>('')

    useEffect(() => {
        
        if(requirements.all === true){
            setText(`All ${requirements.character![0]['race'] !== undefined ? requirements.character![0].race!.concat("s ") : ""} ${ Object.hasOwn( requirements.character![0], 'class') === true  ? requirements.character![0].class!.concat("s") : ""}`)
        }
        
    },[requirements])

    return text

}