const { utils, mongoDbUtils } = require('../utils/index');
const { MoviesService } = require('../services');

const slugify = require('slugify');
const { moviesModel } = require('../models');

const { v4: uuidv4 } = require('uuid');

class PostsController {
  all = async (req, res) => {
    try {
      const paginationInfo = {
        page: req.body.page || 1,
        limit: req.body.limit || 25,
        query: {
          ...(req.body.query || {}),
          createdBy: req.userId
        },
        sortBy: req.body.sortBy || 'createdAt',
        sortOrder: req.body.sortBy || 'ASC'
      };

      const movies = await MoviesService.all(paginationInfo);
      if (!movies) {
        throw {
          code: 404,
          message: `Post doesn't exist`
        };
      }

      utils.sendSuccess(res)({
        ...movies
      });
    } catch (error) {
      utils.sendError(res, error.code || 404, error.message || `Error while retrieving all movies`)(error);
    }
  };

  create = async (req, res) => {
    try {
      let movieInfo = req.body;
      movieInfo = {
        _id: uuidv4(),
        title: movieInfo.title,
        slug: slugify(movieInfo.title),
        releasedYear: Number(movieInfo.releasedYear),
        coverUrl: movieInfo.coverUrl,
        createdBy: req.userId,
        updatedBy: req.userId
      };

      await this.validateMovieInfo(req.userId, movieInfo);

      movieInfo = await MoviesService.create(movieInfo);

      utils.sendSuccess(res)({
        ...movieInfo
      });
    } catch (error) {
      utils.sendError(res, error.code || 404, error.message || 'Error while creating Movie.')(error);
    }
  };

  update = async (req, res) => {
    const movieId = req.params.id;

    try {
      const existingMovie = await MoviesService.read({ _id: movieId });
      if (!existingMovie) {
        throw {
          code: 404,
          message: `Movie doesn't exist`
        };
      }

      let movieInfo = req.body;

      // if user tries to update movie title which already exists
      if (movieInfo?.title && movieInfo.title !== existingMovie.title) {
        await this.checkIfMovieWithSameNameExists(req.userId, movieInfo.title);
      }

      movieInfo = {
        title: movieInfo.title || existingMovie.title,
        slug: slugify(movieInfo.title || existingMovie.title),
        coverUrl: movieInfo.coverUrl || existingMovie.coverUrl,
        releasedYear: Number(movieInfo.releasedYear || existingMovie.releasedYear)
      };

      await MoviesService.update(movieId, { ...movieInfo });

      utils.sendSuccess(res)({
        success: true
      });
    } catch (error) {
      utils.sendError(res, error.code || 404, error.message || `Error while updating movie: ${movieId}`)(error);
    }
  };

  validateMovieInfo = async (userId, movieInfo) => {
    if (!movieInfo.title) {
      throw {
        code: 400,
        message: 'Name is required'
      };
    }

    if (!movieInfo.releasedYear) {
      throw {
        code: 400,
        message: 'Released year is required'
      };
    }

    if (!movieInfo.coverUrl) {
      throw {
        code: 400,
        message: 'Please upload cover photo'
      };
    }

    await this.checkIfMovieWithSameNameExists(userId, movieInfo.title);
  };

  checkIfMovieWithSameNameExists = async (userId, title) => {
    const movies = await mongoDbUtils.getAllRecordsByQuery(moviesModel, { title, createdBy: userId });
    if (movies?.length) {
      throw {
        code: 409,
        message: 'Movie with same name already exists.'
      };
    }
  };
}

module.exports = new PostsController();