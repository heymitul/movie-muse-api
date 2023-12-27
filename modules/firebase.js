const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;