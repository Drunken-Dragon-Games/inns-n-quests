import { AppNotification } from "./notifications-dsl"
import Transitions from "./notifications-transitions"

export default {

    notify: (message: string, ctype: AppNotification["ctype"]) =>
        Transitions.notify(message, ctype)
}
