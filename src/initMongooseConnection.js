const mongoose = require('mongoose');
const { mongoURL } = require('./config');

const imagesModel = mongoose.Schema({
  images: mongoose.Schema.Types.Mixed,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  imagesModel,
  init: () => mongoose.createConnection(mongoURL, { useNewUrlParser: true }),
  mongo: mongoose.mongo,
};
