import Link from "next/link"
import { ConditionalRender } from "./"

interface LinkDisable {
    children: JSX.Element | JSX.Element []
    url: string
    disable?: boolean
    openExternal?: boolean
}

const LinkDisable = ({children, url, disable, openExternal}: LinkDisable): JSX.Element => {
    
    return(<>

            <ConditionalRender condition = {disable == true}>
                {children}
            </ConditionalRender>

            <ConditionalRender condition = {disable != true}>
                <Link href={url}>
                        {openExternal
                            ?
                                <a target="_blank">
                                    {children}
                                </a>
                            : 
                                children
                            }
                    </Link>
            </ConditionalRender>
               
    </>)
}

export default LinkDisable