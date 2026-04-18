const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefit: { type: String, required: true },
  link: { type: String, required: true }
});

module.exports = mongoose.model('Scheme', schemeSchema);
