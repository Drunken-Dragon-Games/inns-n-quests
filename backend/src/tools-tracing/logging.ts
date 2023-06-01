import { v4 } from "uuid"
import winston from "winston"
import WinstonCloudWatch from "winston-cloudwatch"
import { Request } from "express"

export type LoggerLevel = "error" | "warn" | "info" | "debug"

export type LoggingContextOptions 
    = { ctype: "provided-logger", logger: winston.Logger } 
    | {
        ctype: "params",
        level?: LoggerLevel,
        environment?: string,
        component?: string,
        endpoint?: string,
        traceId?: string,
    }

export class LoggingContext {

    public readonly level?: LoggerLevel
    public readonly environment?: string
    public readonly component?: string
    public readonly endpoint?: string
    public readonly traceId?: string

    public readonly log: winston.Logger

    constructor (options: LoggingContextOptions) {
        if (options.ctype == "params") {
            const environment = options.environment ?? "local"
            const transports = environment != "local" ?
                [ new WinstonCloudWatch({
                    logGroupName: options.environment,
                    logStreamName: "backend",
                    awsRegion: "us-east-1",
                    jsonMessage: true
                  }) 
                , new winston.transports.Console()
                ] :
                [ new winston.transports.Console() ]
            this.level = options.level
            this.environment = environment
            this.component = options.component
            this.endpoint = options.endpoint
            this.traceId = options.traceId
            this.log = winston.createLogger({
                level: options.level,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
                defaultMeta: {
                    //environment, 
                    //component: options.component, 
                    endpoint: options.endpoint, 
                    traceId: options.traceId
                },
                transports
            })
        } else {
            this.log = options.logger
        }
    }

    static create(component: string): LoggingContext {
        if (process.env.NODE_ENV === "production") return LoggingContext.prod(component)
        else if (process.env.TEST_CLOUDWATCH === "true") return LoggingContext.localTest(component)
        else return LoggingContext.local(component)
    }

    static localTest(component: string): LoggingContext {
        return new LoggingContext({ ctype: "params", level: "info", environment: "Preprod", component })
    }

    static local(component: string): LoggingContext {
        return new LoggingContext({ ctype: "params", level: "info", environment: "local", component })
    }

    static prod(component: string): LoggingContext {
        return new LoggingContext({ ctype: "params", level: "info", environment: process.env.CARDANO_NETWORK, component })
    }

    info(message: string, context?: object): void {
        this.log.info({ message, ...context })
    }

    warn(message: string, context?: object): void {
        this.log.warn({ message, ...context })
    }

    error(message: string, context?: object): void {
        this.log.error({ message, ...context })
    }

    debug(message: string, context?: object): void {
        this.log.debug({ message, ...context })
    }

    trace(request: Request): LoggingContext {
        const traceId = request.header("Trace-ID") ?? v4()
        return new LoggingContext({ ctype: "params",
            level: this.level, environment: this.environment,
            component: this.component, endpoint: request.path, traceId })
    }

    testTrace(): LoggingContext {
        return new LoggingContext({ ctype: "params",
            level: this.level, environment: this.environment, 
            component: this.component, endpoint: this.endpoint, traceId: v4() })
    }

    withComponent(component: string | undefined): LoggingContext {
        return new LoggingContext({ ctype: "params",
            level: this.level, environment: this.environment, 
            component: component, endpoint: this.endpoint, traceId: this.traceId })
    }

    withEndpoint(endpoint: string | undefined): LoggingContext {
        return new LoggingContext({ ctype: "params",
            level: this.level, environment: this.environment, 
            component: this.component, endpoint: endpoint, traceId: this.traceId })
    }

    withTraceId(traceId: string | undefined): LoggingContext {
        return new LoggingContext({ ctype: "params",
            level: this.level, environment: this.environment, 
            component: this.component, endpoint: this.endpoint, traceId: traceId })
    }
}
