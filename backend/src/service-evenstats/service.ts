import { EvenstatEvent, EvenstatSubscriber } from "./models"
import { EvenstatsService } from "./service-spec"

export class EvenstatsServiceDsl implements EvenstatsService {

    private subscribers: { [ key: string ]: EvenstatSubscriber[] } = {}

    constructor() {}

    static async loadFromEnv(): Promise<EvenstatsServiceDsl> {
        return new EvenstatsServiceDsl()
    }

    subscribe(subscriber: EvenstatSubscriber, ...events: EvenstatEvent["ctype"][]) {
        events.forEach(event => {
            if (!this.subscribers[event]) {
                this.subscribers[event] = []
            }
            this.subscribers[event].push(subscriber)
        })
    }

    publish(event: EvenstatEvent) {
        const subscribers = this.subscribers[event.ctype]
        if (subscribers) subscribers.map(subscriber => subscriber.onEvenstatEvent(event))
    }
}