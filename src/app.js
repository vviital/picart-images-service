const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Logger = require('./logger');
const middlewares = require('./middlewares');
const { port } = require('./config');
const router = require('./routes').create();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(middlewares.requestID);
app.use(middlewares.logger);
app.use(middlewares.request);

app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app.listen(port, () => {
  Logger.info('app is running on port', port);
});
