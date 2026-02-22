const admin = require('../config/firebase');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      req.firebaseUser = decoded;
      return next();
    }
    req.user = user;
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
