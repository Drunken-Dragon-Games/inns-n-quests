import { useEffect, useState } from "react"


interface requirement{
    character?: character []
    all?: boolean
    party?: party
}


interface character {
    class?: string
    race?: string
}

interface party {
    balanced: boolean
}


export default (requirements:requirement): string => {

    const [text, setText] = useState<string>('')

    useEffect(() => {
        
        if(requirements.all === true){
            setText(`All ${requirements.character![0]['race'] !== undefined ? requirements.character![0].race!.concat("s ") : ""} ${ Object.hasOwn( requirements.character![0], 'class') === true  ? requirements.character![0].class!.concat("s") : ""}`)
        }
        
    },[requirements])

    return text

}