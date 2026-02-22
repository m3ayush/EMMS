const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Computer Science',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical',
        'Information Technology',
        'MBA',
        'Other',
      ],
    },
    designation: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['faculty', 'senior'],
      default: 'faculty',
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
