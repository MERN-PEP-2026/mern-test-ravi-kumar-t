const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },

  courseDescription: {
    type: String,
    required: true
  },

  instructor: {
    type: String,
    required: true
  },

  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);