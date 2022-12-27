import { Request } from "express"
import { LoggerLevel, LoggingContext } from "../tools-tracing"

export const logger = new LoggingContext({
    ctype: "params",
    level: (process.env["LOGGER_LEVEL"] ?? "info") as LoggerLevel,
    environment: process.env["ENVIRONMENT"] ?? "local"
})

export const withTracing = (req: Request): LoggingContext => 
    logger.withTraceId(req.header("Trace-ID"))

export default logger 