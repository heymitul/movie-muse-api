const emailValidator = require('email-validator');

const { utils } = require('../utils/index');
const { UsersService } = require('../services');

class UsersController {
  createUser = async (req, res) => {
    try {
      const user = req.body;

      // check if firebase user Id is provided
      if (!user.userId) {
        throw {
          code: 400,
          message: 'UserId is required'
        };
      }

      // check if name is provided
      if (!user.name) {
        throw {
          code: 400,
          message: 'Name is required'
        };
      }

      // check if email is provided
      if (!user.email) {
        throw {
          code: 400,
          message: 'Email is required'
        };
      }

      // check if email address is valid
      if (!emailValidator.validate(user.email)) {
        throw {
          code: 400,
          message: 'Email is invalid'
        };
      }

      user._id = user.userId;
      const newUser = await UsersService.createUser(user);

      utils.sendSuccess(res, 200)({ ...newUser });
    } catch (error) {
      utils.sendError(res, error.code || 500, error.message)(error);
    }
  };
}

module.exports = new UsersController();