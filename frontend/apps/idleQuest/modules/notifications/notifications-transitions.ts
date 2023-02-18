import { IdleQuestsSnD } from "../../idle-quests-state"
import { AppNotification } from "./notifications-dsl"
import { notify, removeTimedOutNotifications } from "./notifications-state"

export type NotificationsTransitions = {
    onNotify: (message: string, ctype: AppNotification["ctype"]) => void
    onRemoveTimedOutNotifications: (now: Date) => void
}

export const notificationsTransitions = ({ state, dispatch }: IdleQuestsSnD): NotificationsTransitions => ({

    onNotify: (message: string, ctype: AppNotification["ctype"]) => {
        dispatch(notify({ message, ctype }))
    },

    onRemoveTimedOutNotifications: (now: Date) => {
        dispatch(removeTimedOutNotifications(now))
    }
})
