/**
 * @swagger
 * tags:
 *   name: User
 *   description: The users managing API
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the user was updated
 *       example:
 *         id: Fi48YVMqj5PIYcvorD3ZgPavzEg2
 *         name: Mitul Gedeeya
 *         email: imitul.karishyen@gmail.com
 *         createdAt: 2023-03-27T04:05:06.157Z
 *         updatedAt: 2023-03-27T04:05:06.157Z
 */
const express = require('express');
const router = express.Router();

const { usersController } = require('../controllers/index');

router.post('/', usersController.createUser);

module.exports = router;