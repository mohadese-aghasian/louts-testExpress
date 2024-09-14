const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const uploadMiddleware= require("../middleware/productCoverMilddleware");
const blogController=require("../controllers/blogController");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerConfig');

/////////////


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
 *     summary: Retrieve a list of blogs
 *     description: Fetches a list of blogs with optional pagination, sorting, and filtering.
 *     tags: [Blogs]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of blogs to retrieve. If not provided, returns all blogs.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: start
 *         in: query
 *         description: The starting point (offset) for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: orderby
 *         in: query
 *         description: The column by which to sort the results. Defaults to 'id'.
 *         required: false
 *         schema:
 *           type: string
 *           enum: [title, createdAt, updatedAt, content, id, likeNum, userId]
 *           example: createdAt
 *       - name: orderdir
 *         in: query
 *         description: The direction to sort the results. Defaults to 'ASC'. 
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: DESC
 *     responses:
 *       200:
 *         description: A list of blogs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Blog Title"
 *                   content:
 *                     type: string
 *                     example: "Blog content here..."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00Z"
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid format for parameters!"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
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
//////////////////////////////////////

router.post("/blogs", authenticateJWT, blogController.createBlog);
router.get("/blogs", blogController.getBlogs);
router.post('/blogs/like/:blogId', authenticateJWT, blogController.likeBlog);
router.get("/blogs/oneblog/", authenticateJWT, blogController.getSingleBlog);

/////////////////

router.use('api/v2/api-docs', swaggerUi.serve);
router.get('api/v2/api-docs', swaggerUi.setup(swaggerSpec));


module.exports=router;