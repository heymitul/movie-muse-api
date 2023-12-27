const { moviesModel } = require('../models/index');
const { mongoDbUtils, utils } = require('../utils/index');

class MoviesService {
  all = async (paginationInfo) => {
    return await mongoDbUtils.getAllRecords(moviesModel, paginationInfo);
  };

  create = async (movie) => {
    return await mongoDbUtils.createRecord(moviesModel, { ...movie });
  };

  update = async (movieId, movieInfoToBeUpdated) => {
    await mongoDbUtils.updateRecordById(moviesModel, movieId, { ...movieInfoToBeUpdated });
  };

  read = async (query) => {
    try {
      const movieInfo = await mongoDbUtils.getRecordByQuery(moviesModel, query);
      return movieInfo._doc;
    } catch (error) {
      utils.throwError(500, error.message || 'Error while retrieving post info.')(error);
    }
  };
}

module.exports = new MoviesService();