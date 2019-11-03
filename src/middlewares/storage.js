const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const { init } = require('../initMongooseConnection');

const root = 'uploads';

const storage = new GridFsStorage({
  db: init(),
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: root,
        };
        return resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

module.exports = upload.single('file');
