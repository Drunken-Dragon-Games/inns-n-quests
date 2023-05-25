import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from 'uuid'
import { AppNotification } from "./notifications-dsl"

export type NotificationsState = {
    notifications: AppNotification[]
}

const notificationsInitialState: NotificationsState = { 
    notifications: [
        { ctype: "info", message: "Welcome back adventurer!", notificationId: uuidv4(), createdAt: new Date().getTime() }
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
                createdAt: new Date().getTime()
            })
        },

        removeTimedOutNotifications: (state, action: PayloadAction<number>) => {
            state.notifications = state.notifications.filter(notification =>
                notification.createdAt + 5000 > action.payload)
        }
    }
})

export const {
    notify,
    removeTimedOutNotifications
} = notificationsState.actions

export const notificationsStore = configureStore({
    reducer: notificationsState.reducer,
})
