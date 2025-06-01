const mongoose = require('mongoose');

const scamSchema = new mongoose.Schema({
  scamType: { type: String, required: true },
  description: { type: String, required: true },
  region: { type: String, required: true },
  files: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  creatorEmail: { type: String, default: null },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scam', scamSchema);