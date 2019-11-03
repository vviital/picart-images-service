const GridFsStream = require('gridfs-stream');
const { init, mongo } = require('../initMongooseConnection');

const context = require('../context');

const root = 'uploads';

const create = (connection = init()) => {
  // Init gfs
  let gfs;

  connection.once('open', () => {
    // Init stream
    gfs = GridFsStream(connection.db, mongo);
    gfs.collection(root);
  });

  return {
    createReadStream(id) {
      return gfs.createReadStream({ filename: id, root });
    },

    createWriteStream(filename) {
      return gfs.createWriteStream({ filename, root });
    },

    async delete(filename) {
      const logger = context.getLogger();
      logger.info('deleting file with name', filename);
      await gfs.remove({ filename, root });
    },

    async health() {
      const count = await gfs.files.estimatedDocumentCount();
      const logger = context.getLogger();
      logger.info('files count', count);
    }
  };
};

module.exports = {
  create,
};
