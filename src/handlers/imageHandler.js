const createError = require('http-errors');

const { sizes, supportedContentTypes } = require('../config');
const { resize } = require('../utils/resizer');

const getStaticPage = (req, res) => {
  res.render('index');
};

class ImagesHandler {
  constructor(options = {}) {
    this.storage = options.storage;
  }

  async upload(req, res) {
    const contentType = req.file.contentType;
    const filename = req.file.filename;

    if (!supportedContentTypes.includes(contentType)) {
      await this.storage.fileStorage.delete(filename);

      const error = new createError.UnsupportedMediaType();
      return res.json(error);
    }

    const resizedImages = await resize(
      this.storage.fileStorage.createReadStream(filename),
      x => this.storage.fileStorage.createWriteStream(x),
      filename,
    );

    const images = Object.assign({ original: filename }, ...resizedImages);
    const record = await this.storage.create({ images });

    return res.status(201).json({ ...record, sizes: ['original', ...sizes.map(x => x.name)] });
  }

  async getMetaInfo(req, res) {
    const files = await this.storage.find();
    res.json(files);
  }

  async fetch(req, res) {
    const defaultSize = 'large';
    const id = req.params.id;
    const size = req.query.size || defaultSize;
    const image = await this.storage.findByID(id);

    if (!image) {
      return res.status(404).json({ msg: 'Not Found' });
    }

    const filename = image.images[size] || image.images[defaultSize];
    const stream = this.storage.fileStorage.createReadStream(filename);
    return stream.pipe(res);
  }

  async delete(req, res) {
    await this.storage.deleteByID(req.params.id);

    res.status(204).send();
  }

  // eslint-disable-next-line
  config(req, res) {
    return res.json({ sizes });
  }

  // eslint-disable-next-line
  getStaticPage(...args) {
    return getStaticPage(...args);
  }

  async health(req, res) {
    await Promise.all([
      this.storage.health(),
      this.storage.fileStorage.health(),
    ]);
    res.sendStatus(200);
  }
}

module.exports = ImagesHandler;
