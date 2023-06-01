const mongoose = require('mongoose');

const mongoConnect = async (url, options) => {
  return mongoose.connect(url, options)
}

module.exports = mongoConnect;
