const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const verifyToken = require('../middleware/verifyToken');

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