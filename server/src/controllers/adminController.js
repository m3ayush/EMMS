const User = require('../models/User');
const Mou = require('../models/Mou');
const GracePeriod = require('../models/GracePeriod');
const { getInactiveFacultyMous } = require('../services/inactivityService');
const { success, error } = require('../utils/apiResponse');

exports.dashboardStats = async (req, res, next) => {
  try {
    const stats = await Mou.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'faculty',
          foreignField: '_id',
          as: 'facultyDoc',
        },
      },
      { $unwind: '$facultyDoc' },
      {
        $group: {
          _id: {
            department: '$facultyDoc.department',
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Reshape into { department: { active, expired, renewed, terminated, total } }
    const departments = {};
    for (const item of stats) {
      const dept = item._id.department;
      if (!departments[dept]) {
        departments[dept] = { active: 0, expired: 0, renewed: 0, terminated: 0, total: 0 };
      }
      departments[dept][item._id.status] = item.count;
      departments[dept].total += item.count;
    }

    const totalMous = await Mou.countDocuments();
    const activeMous = await Mou.countDocuments({ status: 'active' });
    const expiredMous = await Mou.countDocuments({ status: 'expired' });

    return success(res, { departments, totalMous, activeMous, expiredMous });
  } catch (err) {
    next(err);
  }
};

exports.listFaculty = async (req, res, next) => {
  try {
    const { department, page = 1, limit = 20 } = req.query;
    const query = { role: 'faculty' };
    if (department) query.department = department;

    const faculty = await User.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    // Get MoU counts for each faculty
    const facultyWithCounts = await Promise.all(
      faculty.map(async (f) => {
        const mouCount = await Mou.countDocuments({ faculty: f._id, status: 'active' });
        return { ...f.toObject(), activeMouCount: mouCount };
      })
    );

    return success(res, { faculty: facultyWithCounts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getFaculty = async (req, res, next) => {
  try {
    const faculty = await User.findById(req.params.id);
    if (!faculty) return error(res, 'Faculty not found', 404);

    const mous = await Mou.find({ faculty: faculty._id })
      .populate('organisation', 'name type')
      .sort({ createdAt: -1 });

    const gracePeriods = await GracePeriod.find({ faculty: faculty._id })
      .populate('mou', 'title')
      .sort({ createdAt: -1 });

    return success(res, { faculty, mous, gracePeriods });
  } catch (err) {
    next(err);
  }
};

exports.getFacultyMous = async (req, res, next) => {
  try {
    const mous = await Mou.find({ faculty: req.params.id })
      .populate('organisation', 'name type')
      .sort({ createdAt: -1 });

    return success(res, mous);
  } catch (err) {
    next(err);
  }
};

exports.inactiveFaculty = async (req, res, next) => {
  try {
    const result = await getInactiveFacultyMous();
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

exports.getOrgMous = async (req, res, next) => {
  try {
    const mous = await Mou.find({ organisation: req.params.id })
      .populate('faculty', 'name email department designation')
      .populate('organisation', 'name type')
      .sort({ createdAt: -1 });

    return success(res, mous);
  } catch (err) {
    next(err);
  }
};

exports.createGracePeriod = async (req, res, next) => {
  try {
    const { facultyId, mouId, reason, graceDays = 30 } = req.body;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + graceDays);

    const gp = await GracePeriod.create({
      mou: mouId,
      faculty: facultyId,
      issuedBy: req.user._id,
      reason,
      graceDays,
      deadline,
    });

    return success(res, gp, 'Grace period issued', 201);
  } catch (err) {
    next(err);
  }
};

exports.listGracePeriods = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const gps = await GracePeriod.find(query)
      .populate('faculty', 'name email department')
      .populate('mou', 'title')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });

    return success(res, gps);
  } catch (err) {
    next(err);
  }
};

exports.updateGracePeriod = async (req, res, next) => {
  try {
    const gp = await GracePeriod.findById(req.params.id);
    if (!gp) return error(res, 'Grace period not found', 404);

    if (req.body.status) {
      gp.status = req.body.status;
      if (req.body.status === 'resolved') {
        gp.resolvedAt = new Date();
      }
    }

    await gp.save();
    return success(res, gp, 'Grace period updated');
  } catch (err) {
    next(err);
  }
};

exports.myGracePeriods = async (req, res, next) => {
  try {
    const gps = await GracePeriod.find({ faculty: req.user._id })
      .populate('mou', 'title')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });

    return success(res, gps);
  } catch (err) {
    next(err);
  }
};
