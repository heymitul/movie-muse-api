'use strict';
const admin = require('../modules/firebase');
const { usersModel } = require('../models');
const { mongoDbUtils } = require('../utils');

module.exports = async function (req, res, next) {
  const originalUrl = req.originalUrl;

  if (req.method === 'OPTIONS') {
    return res.status(200).send({
      success: true
    });
  }

  console.log({
    originalUrl
  })
  if (originalUrl === '/health_check' || originalUrl === '/favicon.ico' || originalUrl.startsWith('/api-docs')) {
    return next();
  }

  let idToken = req.headers.authorization;

  if (!idToken || !idToken.startsWith('Bearer ')) {
    console.error('Authentication is failed due to invalid token.');
    return res.status(401).send({
      auth: false,
      message: 'Token is not available or is Invalid.'
    });
  }

  idToken = idToken.replace('Bearer ', '');

  if (!idToken) {
    console.error('Authentication is failed because token is not available.');
    return res.status(401).send({
      auth: false,
      message: 'Token is not available.'
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    req.userId = uid;

    if (originalUrl.startsWith('/users/create')) {
      return next();
    }

    const user = await mongoDbUtils.getRecordById(usersModel, uid)

    if (user == null) {
      return res.status(404).send({
        message: 'Movie Muse account does not exist.'
      });
    }

    next();
  } catch (error) {
    console.error('Error while checking authorization:: ', error);
    return res.status(401).send({
      auth: false,
      message: 'You are not authorized.'
    });
  }
};