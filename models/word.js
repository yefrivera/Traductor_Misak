// models/Word.js
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    spanish: { type: String, required: true },
    misak: { type: String, required: true }
});

module.exports = mongoose.model('Word', wordSchema);
