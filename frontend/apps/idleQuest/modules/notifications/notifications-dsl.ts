
export type AppNotification = InfoNotification | AlertNotification | SuccessNotification

export type InfoNotification = {
    ctype: "info"
    notificationId: string
    message: string
    createdAt: number
}

export type AlertNotification = {
    ctype: "alert"
    notificationId: string
    message: string
    createdAt: number
}

export type SuccessNotification = {
    ctype: "success"
    notificationId: string
    message: string
    createdAt: number
}
