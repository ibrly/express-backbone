import {
    createLogger,
    format,
    transports
} from "winston";

const {
          combine,
          timestamp,
          printf,
          colorize,
          stack,
          errors,
      } = format;

const myFormat      = printf(({
                                  level,
                                  message,
                                  stack,
                                  timestamp
                              }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});
export const logger = createLogger({
                                       format     : combine(
                                           timestamp({format: 'YY-MM-DD HH-MM-SS'}),
                                           myFormat,
                                           errors({stack: true})
                                       ),
                                       defaultMeta: {service: 'user-service'},
                                       transports : [
                                           new transports.File({
                                                                   filename: 'logger/error.log',
                                                                   level   : 'error'
                                                               }),
                                           new transports.File({filename: 'logger/combined.log'}),
                                       ],
                                   });

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
                                          format: format.simple(),
                                      }));
}
