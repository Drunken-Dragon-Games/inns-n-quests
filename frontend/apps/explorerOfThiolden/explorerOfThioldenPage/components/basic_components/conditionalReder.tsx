
interface ConditionalRender {
    condition: boolean
    children: JSX.Element | JSX.Element [] 
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