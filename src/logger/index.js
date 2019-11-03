const { logger } = require('./logger');

class Logger {
  constructor() {
    this.logger = logger;
    this.created = Date.now();
  }

  static info(...args) {
    logger.info(...args);
  }

  addFields(object = {}) {
    this.logger = this.logger.child(object);
  }

  get elapsedTime() {
    const now = Date.now();
    return now - this.created;
  }

  trace(...args) {
    this.logger.trace({ elapsed: this.elapsedTime }, ...args);
  }

  debug(...args) {
    this.logger.debug({ elapsed: this.elapsedTime }, ...args);
  }

  info(...args) {
    this.logger.info({ elapsed: this.elapsedTime }, ...args);
  }

  warn(...args) {
    this.logger.warn({ elapsed: this.elapsedTime }, ...args);
  }

  error(...args) {
    this.logger.error({ elapsed: this.elapsedTime }, ...args);
  }

  fatal(...args) {
    this.logger.fatal({ elapsed: this.elapsedTime }, ...args);
  }
}

module.exports = Logger;
