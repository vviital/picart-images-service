const small = 'small';
const medium = 'medium';
const large = 'large';

const sizes = [
  {
    name: small,
    height: process.env[`${small.toUpperCase()}_HEIGHT`] || 64,
    width: process.env[`${small.toUpperCase()}_WIDTH`] || 64,
  },
  {
    name: medium,
    height: process.env[`${medium.toUpperCase()}_HEIGHT`] || 640,
    width: process.env[`${medium.toUpperCase()}_WIDTH`] || 640,
  },
  {
    name: large,
    height: process.env[`${large.toUpperCase()}_HEIGHT`] || 2640,
    width: process.env[`${large.toUpperCase()}_WIDTH`] || 2640,
  },
];
const port = +process.env.PORT || 3000;
const mode = process.env.MODE || 'rw';
const env = process.env.NODE_ENV || 'development';
const supportedContentTypes = ['image/png', 'image/jpeg'];
const mongoURL = process.env.MONGODB_URL || 'mongodb://mongo:27017/images';
const logLevel = process.env.LOG_LEVEL || 'info';

module.exports = {
  env,
  logLevel,
  mode,
  mongoURL,
  port,
  sizes,
  supportedContentTypes
};
