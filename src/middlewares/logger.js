const Logger = require('../logger');
const context = require('../context');

module.exports = (req, res, next) => {
  context.init(req, () => {
    const logger = new Logger();
    logger.addFields({ rid: req.requestID });
    context.setLogger(logger);
    next();
  });
};
