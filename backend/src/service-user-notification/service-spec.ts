//I have to thing about how im going to do this, im probably gonann make just a db by username that has notifications
//and then have the forntnedn maybe do some polling
export interface UserNotificationDSl {
    notifyUser(userIs: string, messsage: string):string
}