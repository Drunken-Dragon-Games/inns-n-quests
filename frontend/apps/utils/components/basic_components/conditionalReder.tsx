import { ReactNode } from "react"

interface ConditionalRender {
    condition: boolean
    children: ReactNode
}

const ConditionalRender = ({ condition , children }:ConditionalRender) : JSX.Element => {
    return(<>
        { condition 
            ?
                children
            : 
                null
        }
    
    </>)
}

export default ConditionalRender