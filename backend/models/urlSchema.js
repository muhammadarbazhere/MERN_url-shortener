// const mongoose = require('mongoose');
// const shortid = require('shortid');

// const UrlSchema = new mongoose.Schema({
//   originalUrl: {
//     type: String,
//     required: true,
//   },
//   shortUrl: {
//     type: String,
//     required: true,
//     default: shortid.generate,
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Url', UrlSchema);





const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);
