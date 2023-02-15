
export type AppNotification = InfoNotification | AlertNotification | SuccessNotification

export type InfoNotification = {
    ctype: "info"
    notificationId: string
    message: string
    createdAt: Date
}

export type AlertNotification = {
    ctype: "alert"
    notificationId: string
    message: string
    createdAt: Date
}

export type SuccessNotification = {
    ctype: "success"
    notificationId: string
    message: string
    createdAt: Date
}
