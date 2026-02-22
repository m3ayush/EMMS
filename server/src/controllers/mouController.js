const Mou = require('../models/Mou');
const { success, error } = require('../utils/apiResponse');

exports.create = async (req, res, next) => {
  try {
    const mou = await Mou.create({
      ...req.body,
      faculty: req.user._id,
      lastInteractionDate: new Date(),
    });
    return success(res, mou, 'MoU created', 201);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = { faculty: req.user._id };
    if (status) query.status = status;

    const mous = await Mou.find(query)
      .populate('organisation', 'name type')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Mou.countDocuments(query);

    return success(res, { mous, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const mou = await Mou.findById(req.params.id)
      .populate('organisation')
      .populate('faculty', 'name email department designation')
      .populate('renewedFrom', 'title signedDate expiryDate');

    if (!mou) {
      return error(res, 'MoU not found', 404);
    }

    // Faculty can only see their own, senior can see any
    if (req.user.role === 'faculty' && mou.faculty._id.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized', 403);
    }

    return success(res, mou);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return error(res, 'MoU not found', 404);
    if (mou.faculty.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized', 403);
    }
    if (mou.status !== 'active') {
      return error(res, 'Only active MoUs can be edited', 400);
    }

    const allowedFields = ['title', 'description', 'terms', 'signedCopyUrl', 'signedCopyPath', 'expiryDate'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        mou[field] = req.body[field];
      }
    }

    await mou.save();
    return success(res, mou, 'MoU updated');
  } catch (err) {
    next(err);
  }
};

exports.renew = async (req, res, next) => {
  try {
    const oldMou = await Mou.findById(req.params.id);
    if (!oldMou) return error(res, 'MoU not found', 404);
    if (oldMou.faculty.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized', 403);
    }

    const newMou = await Mou.create({
      title: oldMou.title,
      description: oldMou.description,
      faculty: oldMou.faculty,
      organisation: oldMou.organisation,
      signedCopyUrl: req.body.signedCopyUrl,
      signedCopyPath: req.body.signedCopyPath,
      signedDate: new Date(),
      expiryDate: req.body.newExpiryDate,
      terms: req.body.terms || oldMou.terms,
      renewedFrom: oldMou._id,
      lastInteractionDate: new Date(),
    });

    oldMou.status = 'renewed';
    await oldMou.save();

    return success(res, newMou, 'MoU renewed successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.upcomingExpirations = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 60;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const query = {
      status: 'active',
      expiryDate: { $lte: futureDate, $gte: new Date() },
    };

    // Faculty sees only their own
    if (req.user.role === 'faculty') {
      query.faculty = req.user._id;
    }

    const mous = await Mou.find(query)
      .populate('organisation', 'name type')
      .populate('faculty', 'name email department')
      .sort({ expiryDate: 1 });

    return success(res, mous);
  } catch (err) {
    next(err);
  }
};
