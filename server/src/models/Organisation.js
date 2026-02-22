const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['industry', 'academic', 'government', 'ngo', 'other'],
      required: true,
    },
    address: { type: String },
    contactPerson: { type: String },
    contactEmail: { type: String, lowercase: true },
    contactPhone: { type: String },
    website: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

organisationSchema.index({ name: 'text' });

module.exports = mongoose.model('Organisation', organisationSchema);
