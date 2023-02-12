import { EvenstatEvent, EvenstatSubscriber } from "./models"

export interface EvenstatsService {

    subscribe(subscriber: EvenstatSubscriber, ...events: EvenstatEvent["ctype"][]): void
    
    publish(event: EvenstatEvent): void
}