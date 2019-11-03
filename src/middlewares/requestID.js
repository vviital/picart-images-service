const uuid = require('uuid');

const header = 'X-Request-ID'; // will be replaced by proper one soon

module.exports = (req, res, next) => {
  const requestID = req.headers[header] || uuid.v4();

  req.requestID = requestID;

  next();
};
