const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.sendSuccess = (res, status = 200) => (data) => {
  res.status(status).header('Content-Type', 'application/json', 'access-control-allow-origin', '*').send(data);
};

exports.sendError = (res, status = 500, message) => (error) => {
  let response = {
    type: 'error',
    message: message || error.message
  };

  if (error) {
    response = {
      ...response,
      ...(error.data || {})
    };
  }

  res.status(status).header('Content-Type', 'application/json', 'access-control-allow-origin', '*').send(response);
};

exports.throwError = (code, errorMessage) => (error) => {
  if (!error) {
    error = new Error(errorMessage || 'Default Error');
  }

  error.code = code;
  error.message = errorMessage || error.message;

  throw error;
};

exports.generateHash = async (password) => {
  return await bcrypt.hash(password, saltRounds)
}

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}