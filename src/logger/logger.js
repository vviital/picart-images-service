const pino = require('pino');

const config = require('../config');

const logger = pino({
  name: 'images',
  level: config.logLevel,
  enabled: true,
  timestamp: true,
  messageKey: 'line',
  prettyPrint: config.env === 'development',
});

module.exports = {
  logger,
};
