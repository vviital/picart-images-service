const context = require('../context');

module.exports = (req, res, next) => {
  const logger = context.getLogger();

  res.on('finish', () => {
    logger.info(`method=${req.method} path=${req.path}`);
  });

  next();
};
