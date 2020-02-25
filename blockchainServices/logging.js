const winston = require('winston');

const logger = module.exports = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  )
});

const errorLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ]
});

module.exports = {
    logger,
    errorLogger
}
// logger.log('info', 'This is an information message.');
// errorLogger.log('error', new Error('Error passed as message'));
