import { AppNotification } from "./notifications-dsl"
import { notificationsStore, notify, removeTimedOutNotifications } from "./notifications-state"

export default {

    notify: (message: string, ctype: AppNotification["ctype"]) => 
        notificationsStore.dispatch(notify({ message, ctype })),

    removeTimedOutNotifications: (now: Date) => 
        notificationsStore.dispatch(removeTimedOutNotifications(now.getTime())),
}
