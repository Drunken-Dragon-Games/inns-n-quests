import { AppNotification } from "./notifications-dsl"
import Transitions from "./notifications-transitions"

const NotificationsApi = {

    notify: (message: string, ctype: AppNotification["ctype"]) =>
        Transitions.notify(message, ctype)
}

export default NotificationsApi
