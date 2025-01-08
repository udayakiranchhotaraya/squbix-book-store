const express = require('express');

const {
    signupUser,
    signinUser
} = require('../controllers/auth.controller');

const AuthRouter = express.Router();

// Route for user signup, calls signupUser controller
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: object
 *                 required:
 *                   - firstName
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     description: The first name of the user
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     description: The last name of the user
 *                     example: Doe
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user
 *                 example: P@ssw0rd
 *               role:
 *                 type: string
 *                 description: The role of the user
 *                 enum:
 *                   - Admin
 *                   - User
 *                 example: Admin
 *     responses:
 *       201:
 *         description: User registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User registration successful
 *                 token:
 *                   type: string
 *                   description: JWT token for the user
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   description: Details of the registered user
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       description: The first name of the user
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: The last name of the user
 *                       example: Doe
 *       400:
 *         description: Bad request due to validation or input error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Email is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Some error occurred
 */
AuthRouter.post('/signup', signupUser);

// Route for user signin, calls signinUser controller
/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     description: Authenticates a user and returns a JWT token if the credentials are valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User login successful
 *                 token:
 *                   type: string
 *                   description: JWT token to access protected routes
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: string
 *                   description: The user's name
 *                   example: John Doe
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Some error occurred
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 */
AuthRouter.post('/signin', signinUser);

module.exports = AuthRouter;