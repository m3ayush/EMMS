const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/emms',
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
};
