import Link from "next/link"
import { ReactNode } from "react"

interface LinkDisable {
    children?: ReactNode
    url: string
    disable?: boolean
    openExternal?: boolean
}

const External = ({ children, url }: { children?: ReactNode, url: string }) => 
    <Link href={url} passHref>
        <a target="_blank">{children}</a>
    </Link>

const Internal = ({ children, url }: { children?: ReactNode, url: string }) => 
    <Link href={url} passHref>{children}</Link>

const LinkDisable = ({children, url, disable, openExternal}: LinkDisable) => {
    if (disable) return <>{children}</>
    else if (openExternal) return <External url={url}>{children}</External>
    //return external({children, url})
    else return <Internal url={url}>{children}</Internal>
}

export default LinkDisable