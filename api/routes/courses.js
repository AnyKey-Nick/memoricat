import express from 'express';
import Course from '../models/Course.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all public courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublic: true })
      .populate('creator', 'username')
      .select('-levels.learnables');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course details
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('creator', 'username');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course (authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      creator: req.userId
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;