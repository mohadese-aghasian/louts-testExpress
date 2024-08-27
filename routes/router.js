const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const Controller = require('../controllers/controller');

/////////////


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
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     description: Creates a new blog post.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieves a list of all blogs.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /blogs/like/{blogId}:
 *   post:
 *     summary: Like a blog post
 *     description: Adds a like to a specific blog post.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to like
 *     responses:
 *       200:
 *         description: Blog liked successfully
 *       404:
 *         description: Blog not found
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /blogs/oneblog/:
 *   get:
 *     summary: Get a single blog post
 *     description: Retrieves the details of a single blog post.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to retrieve
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Blog not found
 *       401:
 *         description: Unauthorized
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
/////////////
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

router.post("/login", Controller.login);
router.post("/register", Controller.register);
router.get('/logout', authenticateJWT, Controller.logout);

router.post("/blogs", authenticateJWT, Controller.createBlog);
router.get("/blogs", authenticateJWT, Controller.getBlogs);
router.post('/blogs/like/:blogId', authenticateJWT, Controller.likeBlog);
router.get("/blogs/oneblog/", authenticateJWT, Controller.getSingleBlog);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

router.use('api/v1/api-docs', swaggerUi.serve);
router.get('api/v1/api-docs', swaggerUi.setup(swaggerDocument));


module.exports=router;