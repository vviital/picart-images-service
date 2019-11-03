const cls = require('cls-hooked');

const Logger = require('../logger');

const namespace = cls.createNamespace('images');

const keys = {
  logger: 'logger',
};

const init = (req, callback) => {
  namespace.runAndReturn(callback);
};

const setLogger = (logger) => {
  namespace.set(keys.logger, logger);
};

const getLogger = () => {
  const fromContext = namespace.get(keys.logger);
  return fromContext || new Logger();
};

module.exports = {
  init,
  setLogger,
  getLogger,
};
