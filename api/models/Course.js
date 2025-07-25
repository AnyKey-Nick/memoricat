import mongoose from 'mongoose';

const learnableSchema = new mongoose.Schema({
  id: String,
  learnable: String,
  definition: String,
  media: {
    audio: String,
    image: String
  },
  difficulty: { type: Number, default: 1 },
  notes: String,
  examples: [{
    text: String,
    translation: String
  }]
});

const levelSchema = new mongoose.Schema({
  levelId: String,
  title: String,
  description: String,
  learnables: [learnableSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  targetLanguage: { type: String, required: true },
  instructionLanguage: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  levels: [levelSchema],
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);