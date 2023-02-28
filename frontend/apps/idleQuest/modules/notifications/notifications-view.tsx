import { Provider, useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import { SansSerifFontFamily, InfoScheme, AlertScheme, SuccessScheme } from "../../common"
import { useClockSeconds, useTagRemovals } from "../../utils"
import { AppNotification } from "./notifications-dsl"
import { NotificationsState, notificationsStore } from "./notifications-state"
import Transitions from "./notifications-transitions"

const enterAnimation = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`

const leaveAnimation = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`

const SnackBar = styled.div`
    position: absolute;
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

const SnackList = () => {
    const notifications = useSelector((state: NotificationsState) => state.notifications)
    const render = useTagRemovals(notifications, [], false)
    useClockSeconds(Transitions.removeTimedOutNotifications)
    return <>
        {render.map(({ value, display }) =>
            <Snack key={value.notificationId} ctype={value.ctype} $display={display}>{value.message}</Snack>
        )}
    </>
}

const NotificationsView = () => {
    // Continuous clock (seconds)
    return <Provider store={notificationsStore}>
        <SnackBar>
            <SnackList />
        </SnackBar>
    </Provider>
}

export default NotificationsView