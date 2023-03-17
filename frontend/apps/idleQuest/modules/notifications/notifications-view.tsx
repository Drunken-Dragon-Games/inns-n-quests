import { Provider, useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import { AlertScheme, InfoScheme, SansSerifFontFamily, SuccessScheme, useClockSeconds, useTagRemovals } from "../../common"
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
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 0.2vw;
    z-index: 100;

    @media (min-width: 1025px) {
        left: 45vw;
        width: 20vw;
        padding-top: 0.2vw;
    }

    @media (max-width: 1024px) {
        right: 0;
    }
`

const Snack = styled.div<{ ctype: AppNotification["ctype"], $display: boolean }>`
    ${SansSerifFontFamily}
    ${props => 
        props.ctype === "info" ? InfoScheme :  
        props.ctype === "alert" ? AlertScheme :
        SuccessScheme
    };
    opacity: ${props => props.$display ? 1 : 0};
    animation: ${props => props.$display ? enterAnimation : leaveAnimation} 1s ease-in-out;
    position: ${props => props.$display ? "relative" : "absolute"};

    @media (min-width: 1025px) {
        padding: 0.5vw 1vw;
        border-radius: 0.2vw;
        min-width: 10vw;
    }

    @media (max-width: 1024px) {
        background-color: rgba(0,0,0,0.5);
        padding: 1vw 2vw;
        border-radius: 0.5vw;
        min-width: 20vw;
        font-size: 14px;
    }
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