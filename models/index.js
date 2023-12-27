const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoDb = {};

mongoDb.mongoose = mongoose;
mongoose.connect(process.env.MONGO_DB_URL).then(() => {
  console.log('Connected to Mongoose');
}).catch(error => {
  console.log({
    error
  })
});

mongoDb.url = process.env.MONGO_DB_URL;

mongoDb.usersModel = require('./users.model')(mongoose);
mongoDb.moviesModel = require('./movies.model')(mongoose);

module.exports = mongoDb;
