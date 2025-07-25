import mongoose from 'mongoose';

const learnableProgressSchema = new mongoose.Schema({
  learnableId: String,
  phase: {
    type: String,
    enum: ['new', 'learning', 'reviewing', 'mastered'],
    default: 'new'
  },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  lastSeen: Date,
  nextReview: Date,
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 0 }
});

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  learnables: [learnableProgressSchema],
  totalLearned: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now }
});

export default mongoose.model('Progress', progressSchema);