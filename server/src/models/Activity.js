const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    mou: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mou',
      required: true,
      index: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'meeting',
        'workshop',
        'student_exchange',
        'faculty_visit',
        'project_collaboration',
        'guest_lecture',
        'internship_placement',
        'other',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    attachmentUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
