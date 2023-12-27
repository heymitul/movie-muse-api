/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: The movies managing API
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: The created Movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Some server error
 * /movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: Id of movie to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: The created Movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessRes'
 *       500:
 *         description: Some server error
 * /movies/all:
 *   post:
 *     summary: Retrieves paginated data of movies
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: The filterd Movies based on given pagination info.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Some server error
 * components:
 *   schemas:
 *     SuccessRes:
 *       type: object
 *       properties:
 *        success:
 *          type: boolean
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - releasedYear
 *         - coverUrl
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of movie
 *         title:
 *           type: string
 *           description: The title of the movie
 *         slug:
 *           type: string
 *           description: slug based on the movie title
 *         releasedYear:
 *           type: number
 *           description: Release year of the movie
 *         coverUrl:
 *           type: string
 *           description: URL of the cover photo of the movie
 *         createdBy:
 *           type: string
 *           description: User Id who created the movie information
 *         updatedBy:
 *           type: string
 *           description: User Id who updated the movie information
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the user was updated
 *       example:
 *         id: 3f905027-0f15-4b11-ae02-ce7ecf03a1cc
 *         title: Deewar
 *         slog: deewar
 *         releasedYear: 1975
 *         coverUrl: https://firebasestorage.googleapis.com/v0/b/app-moviemuse.appspot.com/o/movieCovers%2FFi48YVMqj5PIYcvorD3ZgPavzEg2%2F51-mVCErNjL._AC_UF1000%2C1000_QL80_.jpg?alt=media&token=c9e7709c-fee0-491e-acf5-c7858bba16a3
 *         createdBy: Fi48YVMqj5PIYcvorD3ZgPavzEg2
 *         updatedBy: Fi48YVMqj5PIYcvorD3ZgPavzEg2
 *         createdAt: 2023-03-27T04:05:06.157Z
 *         updatedAt: 2023-03-27T04:05:06.157Z
 *     MoviePagination:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           description: page number for which movies are required in response
 *         limit:
 *           type: string
 *           description: Number of movies required in response
 *         query:
 *           type: object
 *           description: Filter to apply on movie
 *         sortBy:
 *           type: string
 *           description: Field name based on sort will work
 *         sortOrder:
 *           type: string
 *           description: Sort order
 *       example:
 *         page: 1
 *         limit: 25
 */
const express = require('express');
const router = express.Router();

const { moviesController } = require('../controllers/index');

router.post('/all', moviesController.all); // to Support filters and pagination used POST
router.post('/', moviesController.create);
router.put('/:id', moviesController.update);

module.exports = router;