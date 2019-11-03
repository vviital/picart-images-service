const GridFS = require('../datasources/gridfs');
const ImagesHandler = require('./imageHandler');
const ImagesStorage = require('../datasources/images');
const { init } = require('../initMongooseConnection');

const connection = init();

const gridFS = GridFS.create(connection);
const images = ImagesStorage.create(connection, gridFS);

const handler = new ImagesHandler({ storage: images });

module.exports = {
  handler,
};
