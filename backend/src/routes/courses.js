const router = require('express').Router();
const Course = require('../models/Course');
const { verifyToken, permit } = require('../middleware/auth');

router.post('/import', verifyToken, permit('creator', 'admin'), async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

module.exports = router;
