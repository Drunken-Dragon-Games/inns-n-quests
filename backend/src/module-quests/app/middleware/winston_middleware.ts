import winston from "winston";
import expressWinston from "express-winston"


/***************** HANDLE LOGS *****************/

const winstonMiddleware = expressWinston.logger({
    // SETS LOG FILES
    transports: [
      new winston.transports.Console(),
      /*
      new winston.transports.File({
        filename: 'access.log',
        level: 'info'
      }),
      new winston.transports.File({
        filename: 'errors.log',
        level: 'error'
      })
      */
    ],
    // FORMAT LOGS
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
      })
    ),
    meta: false,
    msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms", // SETS MESSAGE
    statusLevels: true,
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
  });

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'access.log' })
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} WARNING: ${message}`;
      })
    ),
  });

  export {
      winstonMiddleware,
      logger
  }