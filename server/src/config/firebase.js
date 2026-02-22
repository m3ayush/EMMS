const path = require('path');
const admin = require('firebase-admin');
const { firebaseServiceAccountPath } = require('./env');

if (firebaseServiceAccountPath) {
  const absolutePath = path.resolve(process.cwd(), firebaseServiceAccountPath);
  const serviceAccount = require(absolutePath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.initializeApp();
}

module.exports = admin;
