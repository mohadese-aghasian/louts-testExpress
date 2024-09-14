const express = require('express');
const userRouter = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const uploadMiddleware= require("../middleware/productCoverMilddleware");
const userController=require("../controllers/userController");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swaggerConfig');



/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout the current user
 *     description: Logs out the current user by invalidating their JWT token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Swagger API documentation
 *     description: Provides the Swagger UI for API documentation.
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Swagger UI served successfully
 */


userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);
userRouter.get('/logout', authenticateJWT, userController.logout);


userRouter.use('api/v1/api-docs', swaggerUi.serve);
userRouter.get('api/v1/api-docs', swaggerUi.setup(swaggerSpec));

module.exports=userRouter;