import { addColors, createLogger, transports, format } from 'winston';

addColors({
  error: 'inverse bold red',
  warn: 'inverse bold yellow',
  info: 'inverse bold green',
  verbose: 'inverse bold blue',
  debug: 'inverse bold white',
  silly: 'bold blue'
});

const logger = createLogger({
  level: 'silly',
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
