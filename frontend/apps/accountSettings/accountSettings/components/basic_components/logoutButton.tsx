import { Button } from "../../../../utils/components/basic_components"
import { fetchLogout } from "../../features/logout"
import { useGeneralDispatch } from "../../../../../features/hooks"

const LogoutButton = () : JSX.Element =>{

    const generalDispatch = useGeneralDispatch()

    return (<>
        <Button action ={()=> generalDispatch(fetchLogout())}>Logout</Button>
    </>)
}

export default LogoutButton