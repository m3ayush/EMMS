const mongoose = require('mongoose');

const gracePeriodSchema = new mongoose.Schema(
  {
    mou: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mou',
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    graceDays: {
      type: Number,
      required: true,
      default: 30,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'escalated'],
      default: 'active',
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

gracePeriodSchema.index({ faculty: 1, status: 1 });

module.exports = mongoose.model('GracePeriod', gracePeriodSchema);
