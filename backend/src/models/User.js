const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'creator', 'admin'], default: 'user' },
  preferences: {
    sessionWords: { type: Number, default: 10 },
    reviewGoal: { type: Number, default: 20 },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
