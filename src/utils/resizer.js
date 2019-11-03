const sharp = require('sharp');

const { sizes } = require('../config');
const context = require('../context');

const resizerError = 'Cannot resize image';

const withError = (stream, cb, msg) => {
  const logger = context.getLogger();
  return stream.on('error', (err) => {
    logger.error(msg, err);
    cb(err);
  });
};

const resizeSingleImage = (readableStream, createWriteStream) => async (size = {}, file) => {
  try {
    const { width, height, name } = size;
    const resizer = sharp()
      .resize(width, height)
      .jpeg({
        quality: 50,
        compressionLevel: 4,
        force: true,
      });

    const writableStream = createWriteStream(file);

    const promise = new Promise((resolve, reject) => {
      withError(readableStream, reject, 'readableStream')
        .pipe(withError(resizer, reject, 'resizer'))
        .pipe(withError(writableStream, reject, 'writableStream'))
        .on('finish', resolve);
    });
    await promise;

    return { [name]: file };
  } catch (error) {
    const logger = context.getLogger();
    logger.error(error);
    throw new Error(resizerError);
  }
};

const resize = async (readableStream, createWriteStream, filename) => {
  const resizer = resizeSingleImage(readableStream, createWriteStream);
  const resizedImages = await Promise.all(sizes.map(size => {
    const file = `${size.name}-${filename}`;
    return resizer(size, file);
  }));

  return resizedImages;
};

module.exports = {
  resize,
};
