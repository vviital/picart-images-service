const context = require('../context');
const { init, imagesModel } = require('../initMongooseConnection');

const collection = 'images';

const notFound = 'Image Not Found';

const create = (connection = init(), fileStorage) => {
  const Model = connection.model(collection, imagesModel);

  return ({
    get fileStorage() {
      return fileStorage;
    },

    async find() {
      return Model.find({});
    },

    async create(values) {
      const obj = new Model(values);

      const saved = await obj.save();

      return { id: saved._id };
    },

    async findByID(id) {
      return Model.findById(id);
    },

    async deleteByID(id) {
      const logger = context.getLogger();

      const record = await this.findByID(id);
      if (!record) {
        throw new Error(notFound);
      }
      const files = Object.values(record.images);
      await Promise.all([
        ...files.map(file => fileStorage.delete(file).catch(err => logger.error(err))),
        Model.remove({ _id: id }),
      ]);
      return Model.remove({ _id: id });
    },

    async health() {
      const count = await Model.estimatedDocumentCount();
      const logger = context.getLogger();
      logger.info('images count', count);
    }
  });
};

module.exports = {
  create,
};
