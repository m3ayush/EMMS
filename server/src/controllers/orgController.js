const Organisation = require('../models/Organisation');
const Mou = require('../models/Mou');
const { success, error } = require('../utils/apiResponse');

exports.create = async (req, res, next) => {
  try {
    const org = await Organisation.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return success(res, org, 'Organisation created', 201);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }

    const orgs = await Organisation.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Organisation.countDocuments(query);

    return success(res, { orgs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const org = await Organisation.findById(req.params.id).populate('createdBy', 'name email');
    if (!org) {
      return error(res, 'Organisation not found', 404);
    }

    const mous = await Mou.find({ organisation: org._id })
      .populate('faculty', 'name email department')
      .sort({ createdAt: -1 });

    return success(res, { organisation: org, mous });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const org = await Organisation.findById(req.params.id);
    if (!org) {
      return error(res, 'Organisation not found', 404);
    }
    if (org.createdBy.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized to edit this organisation', 403);
    }

    const allowedFields = ['name', 'type', 'address', 'contactPerson', 'contactEmail', 'contactPhone', 'website'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        org[field] = req.body[field];
      }
    }

    await org.save();
    return success(res, org, 'Organisation updated');
  } catch (err) {
    next(err);
  }
};
