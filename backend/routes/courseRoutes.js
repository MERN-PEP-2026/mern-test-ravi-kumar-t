const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? { courseName: { $regex: search, $options: 'i' } }
      : {};

    const courses = await Course.find(filter)
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
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

// ─────────────────────────────────────────────────
// PUT /api/courses/:id — ADMIN ONLY: Edit course
// ─────────────────────────────────────────────────
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
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


router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/enroll', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/leave', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      id => id.toString() !== req.user.id
    );
    await course.save();

    res.json({ message: 'Left course successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;