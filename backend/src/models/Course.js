const mongoose = require('mongoose');

const learnableSchema = new mongoose.Schema({
  id: String,
  phrase: String,
  translation: String,
  tokens: [String],
  translationTokens: [String],
  difficulty: { type: Boolean, default: false },
  media: {
    image: String,
    audio: String,
    video: String,
  },
  screens: mongoose.Schema.Types.Mixed,
});

const levelSchema = new mongoose.Schema({
  name: String,
  learnables: [learnableSchema],
});

const courseSchema = new mongoose.Schema({
  title: String,
  language: String,
  instructionLanguage: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  levels: [levelSchema],
});

module.exports = mongoose.model('Course', courseSchema);
