import { EvenstatsService } from "../../service-evenstats/index.js"

export default class EvenstatsServiceMock {

    public readonly service: EvenstatsService

    constructor() {
        this.service = {
            loadDatabaseModels: jest.fn(),
            unloadDatabaseModels: jest.fn(),
            subscribe: jest.fn(),
            publish: jest.fn(),
        }
        jest.spyOn(this.service, "subscribe")
            .mockReturnValue()
        jest.spyOn(this.service, "publish")
            .mockReturnValue(Promise.resolve())
    }
}