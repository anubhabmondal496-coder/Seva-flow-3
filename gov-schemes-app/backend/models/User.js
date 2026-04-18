const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  income: Number,
  education: String,
  state: String,
  bookmarkedSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }]
});

module.exports = mongoose.model('User', userSchema);
