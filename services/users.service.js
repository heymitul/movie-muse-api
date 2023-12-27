const { usersModel } = require('../models');
const { mongoDbUtils, utils } = require('../utils/index');
const crypto = require('crypto');

class UsersService {
  me = async (userId) => {
    try {
      return await mongoDbUtils.getRecordById(usersModel, userId);
    } catch (error) {
      utils.throwError(500, error.message || 'Error while retrieving user info.')(error);
    }
  };

  createUser = async (user) => {
    let existingUser = await mongoDbUtils.getRecordByQuery(usersModel, { email: user.email });
    if (existingUser) {
      return utils.throwError(409, 'User already exists.')();
    }

    return mongoDbUtils.createRecord(usersModel, { ...user });
  };

  checkIfUserExists = async (userId) => {
    const user = await this.me(userId);
    if (!user) {
      throw {
        code: 404,
        message: 'User not found'
      };
    }

    return user;
  };
}

module.exports = new UsersService();