import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from 'uuid'
import { AppNotification } from "../dsl"

export type NotificationsState = {
    notifications: AppNotification[]
}

const notificationsInitialState: NotificationsState = { 
    notifications: [
        { ctype: "info", message: "Welcome back adventurer!", notificationId: uuidv4(), createdAt: new Date() }
    ]
}

export const notificationsState = createSlice({
    name: "notifications-state",
    initialState: notificationsInitialState,
    reducers: {

        notify: (state, action: PayloadAction<{ message: string, ctype: AppNotification["ctype"] }>) => {
            state.notifications.push({
                ctype: action.payload.ctype,
                message: action.payload.message,
                notificationId: uuidv4(),
                createdAt: new Date()
            })
        },

        removeTimedOutNotifications: (state, action: PayloadAction<Date>) => {
            state.notifications = state.notifications.filter(notification =>
                notification.createdAt.getTime() + 5000 > action.payload.getTime())
        }
    }
})

export const {
    notify,
    removeTimedOutNotifications
} = notificationsState.actions
