const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const verifyToken = require('../middleware/verifyToken');

// POST /api/courses — Create course
router.post('/', verifyToken, async (req, res) => {
  try {
    const { courseName, courseDescription, instructor } = req.body;

    const course = new Course({ courseName, courseDescription, instructor });
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses — Get all courses (with optional search)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? { courseName: { $regex: search, $options: 'i' } }
      : {};

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/courses/:id — Edit course ✅ NEW
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { courseName, courseDescription, instructor } = req.body;

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, courseDescription, instructor },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Course not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/courses/:id — Delete course
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;