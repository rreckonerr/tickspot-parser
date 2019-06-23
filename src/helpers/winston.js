import { addColors, createLogger, transports, format } from 'winston';

addColors({
  error: 'inverse red',
  warn: 'inverse yellow',
  info: 'inverse bold green',
  verbose: 'inverse blue',
  debug: 'inverse white',
  silly: 'bold gray'
});

const logger = createLogger({
  level: 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  },
  format: format.combine(format.simple()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize({ all: true }))
    }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

export default logger;
