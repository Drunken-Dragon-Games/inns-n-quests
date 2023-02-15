import styled, { keyframes } from "styled-components"
import { AppNotification } from "../../dsl"
import { useTagRemovals } from "../../utils"
import { AlertScheme, InfoScheme, SansSerifFontFamily, SuccessScheme } from "../common-css"

const enterAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const leaveAnimation = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`

const SnackBar = styled.div`
    position: fixed;
    top: 0;
    left: 45vw;
    width: 20vw;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 0.2vw;
    padding-top: 0.2vw;
    z-index: 100;
`

const Snack = styled.div<{ ctype: AppNotification["ctype"], $display: boolean }>`
    padding: 0.5vw 1vw;
    border-radius: 0.2vw;
    min-width: 10vw;
    ${SansSerifFontFamily}
    ${props => 
        props.ctype === "info" ? InfoScheme :  
        props.ctype === "alert" ? AlertScheme :
        SuccessScheme
    };
    opacity: ${props => props.$display ? 1 : 0};
    animation: ${props => props.$display ? enterAnimation : leaveAnimation} 1s ease-in-out;
    position: ${props => props.$display ? "relative" : "absolute"};
`

interface NotificationsProps {
    notifications: AppNotification[]
}

const Notifications = ({ notifications }: NotificationsProps) => {
    const render = useTagRemovals(notifications, [], false)
    return (
        <SnackBar>
            {render.map(({ value, display }) => 
                <Snack key={value.notificationId} ctype={value.ctype} $display={display}>{value.message}</Snack>
            )}
        </SnackBar>
    )
}

export default Notifications