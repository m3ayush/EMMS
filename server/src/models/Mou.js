const mongoose = require('mongoose');

const mouSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
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
      index: true,
    },
    signedCopyUrl: {
      type: String,
      required: true,
    },
    signedCopyPath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'renewed', 'terminated'],
      default: 'active',
      index: true,
    },
    signedDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    renewedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mou',
      default: null,
    },
    lastInteractionDate: {
      type: Date,
      default: Date.now,
    },
    terms: {
      type: String,
    },
  },
  { timestamps: true }
);

mouSchema.index({ status: 1, expiryDate: 1 });
mouSchema.index({ faculty: 1, lastInteractionDate: 1 });

// Auto-expire MoUs whose expiryDate has passed
mouSchema.pre(['find', 'findOne'], async function () {
  await mongoose.model('Mou').updateMany(
    { status: 'active', expiryDate: { $lt: new Date() } },
    { $set: { status: 'expired' } }
  );
});

module.exports = mongoose.model('Mou', mouSchema);
