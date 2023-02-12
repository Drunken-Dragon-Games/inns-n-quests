import { EvenstatsService } from "../../service-evenstats"

export default class EvenstatsServiceMock {

    public readonly service: EvenstatsService

    constructor() {
        this.service = {
            subscribe: jest.fn(),
            publish: jest.fn(),
        }
        jest.spyOn(this.service, "subscribe")
            .mockReturnValue()
        jest.spyOn(this.service, "publish")
            .mockReturnValue()
    }
}