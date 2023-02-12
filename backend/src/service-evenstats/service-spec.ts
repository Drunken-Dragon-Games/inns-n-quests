import { EvenstatsEvent, EvenstatsSubscriber } from "./models"

export interface EvenstatsService {

    loadDatabaseModels(): Promise<void>

    unloadDatabaseModels(): Promise<void>

    subscribe(subscriber: EvenstatsSubscriber, ...events: EvenstatsEvent["ctype"][]): void
    
    publish(event: EvenstatsEvent): Promise<void>
}