const Activity = require('../models/Activity');
const Mou = require('../models/Mou');
const GracePeriod = require('../models/GracePeriod');
const { success, error } = require('../utils/apiResponse');

exports.create = async (req, res, next) => {
  try {
    const { mouId, type, description, date, attachmentUrl } = req.body;

    const mou = await Mou.findById(mouId);
    if (!mou) return error(res, 'MoU not found', 404);
    if (mou.faculty.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized', 403);
    }

    const activity = await Activity.create({
      mou: mouId,
      faculty: req.user._id,
      organisation: mou.organisation,
      type,
      description,
      date: new Date(date),
      attachmentUrl,
    });

    // Update MoU lastInteractionDate
    const activityDate = new Date(date);
    if (activityDate > mou.lastInteractionDate) {
      mou.lastInteractionDate = activityDate;
      await mou.save();
    }

    // Auto-resolve active grace periods for this MoU
    await GracePeriod.updateMany(
      { mou: mouId, faculty: req.user._id, status: 'active' },
      { status: 'resolved', resolvedAt: new Date() }
    );

    return success(res, activity, 'Activity logged', 201);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { mouId, page = 1, limit = 20 } = req.query;
    const query = { faculty: req.user._id };
    if (mouId) query.mou = mouId;

    const activities = await Activity.find(query)
      .populate('mou', 'title')
      .populate('organisation', 'name')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Activity.countDocuments(query);

    return success(res, { activities, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getByMou = async (req, res, next) => {
  try {
    const mou = await Mou.findById(req.params.mouId);
    if (!mou) return error(res, 'MoU not found', 404);

    // Faculty can only see their own MoU activities
    if (req.user.role === 'faculty' && mou.faculty.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized', 403);
    }

    const activities = await Activity.find({ mou: req.params.mouId })
      .populate('faculty', 'name email')
      .sort({ date: -1 });

    return success(res, activities);
  } catch (err) {
    next(err);
  }
};
