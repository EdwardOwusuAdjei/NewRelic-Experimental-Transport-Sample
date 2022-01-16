const { createLogger, format, transports } = require("winston");
const newrelicFormatter = require("@newrelic/winston-enricher");
const { NewRelicApiTransport } = require('nr-nodejs-logger'),
{ combine, timestamp, label, errors } = format;

// set default log level.
const logLevel = "info";
newRelicApiTransport = new NewRelicApiTransport({
  attributes: {
    app: 'test',
    env: 'development',
    logger: 'winston'
  },
  licenseKey:'' //SETUP
})

const logger = createLogger({
  level: logLevel,
  levels: {
    fatal: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  handleExceptions: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: format.combine(newrelicFormatter(),
      timestamp(),
      errors(),
      format.label({ label: "test" })),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "app.log",
    }),
    newRelicApiTransport
  ],
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;