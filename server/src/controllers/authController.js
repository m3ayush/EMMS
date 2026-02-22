const User = require('../models/User');
const { success, error } = require('../utils/apiResponse');

exports.register = async (req, res, next) => {
  try {
    const { name, department, designation, role, phone } = req.body;
    const { uid, email } = req.firebaseUser;

    const existing = await User.findOne({ firebaseUid: uid });
    if (existing) {
      return error(res, 'User already registered', 400);
    }

    const user = await User.create({
      firebaseUid: uid,
      email,
      name,
      department,
      designation,
      role: role || 'faculty',
      phone,
    });

    return success(res, user, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return error(res, 'User not registered', 404);
    }
    return success(res, req.user);
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return error(res, 'User not registered', 404);
    }

    const allowedFields = ['name', 'phone', 'department', 'designation'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return success(res, user, 'Profile updated');
  } catch (err) {
    next(err);
  }
};
