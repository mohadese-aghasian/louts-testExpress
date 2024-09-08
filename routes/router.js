const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const Controller = require('../controllers/controller');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerConfig');

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
//////////////////////////////////////
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all Products
 *     description: Retrieves a list of all products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
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
 *                   description:
 *                     type: string
 *                   price:
 *                     type: integer
 *                   cover:
 *                     type: string
 *
 *       500:
 *         description: Server Error
 */
/**
 * @swagger
 * /products/addfavourite/{productId}:
 *   post:
 *     summary: Add or remove a product from the user's favourites
 *     description: Toggles the favourite status of a product for the authenticated user. If the product is already in favourites, it will be removed; otherwise, it will be added.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product 
 *     responses:
 *       201:
 *         description: Product added to favourites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: added to favourite!
 *                 result:
 *                   type: object
 *                   description: The favourite product object
 *       202:
 *         description: Product removed from favourites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: removed from favourite.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /addproduct:
 *   post:
 *     summary: Add a new product
 *     description: Creates a new product in the database with the provided details, including a reference to a cover image.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the product.
 *                 example: 'Sample Product'
 *               description:
 *                 type: string
 *                 description: A detailed description of the product.
 *                 example: 'This is a sample product description.'
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *                 example: 99.99
 *               coverId:
 *                 type: integer
 *                 description: The ID of the cover image associated with the product.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created successfully with the provided details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Product created successfully'
 *                 newproduct:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the newly created product.
 *                       example: 1
 *                     title:
 *                       type: string
 *                       description: The title of the product.
 *                       example: 'Sample Product'
 *                     description:
 *                       type: string
 *                       description: The description of the product.
 *                       example: 'This is a sample product description.'
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The price of the product.
 *                       example: 99.99
 *                     coverId:
 *                       type: integer
 *                       description: The ID of the cover image associated with the product.
 *                       example: 1
 *       400:
 *         description: Bad request if required fields are missing or validation fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Bad request: Missing required fields or validation failed.'
 *       500:
 *         description: Internal server error if the product creation fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to create the product.'
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Database error or other issue.'
 */

/**
 * @swagger
 * /addproduct/cover:
 *   post:
 *     summary: Uploads a cover image for a product
 *     description: Processes an uploaded image and creates a new ProductCover entry in the database with the image name.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded.
 *     responses:
 *       '201':
 *         description: Successfully uploaded the cover image and created a new ProductCover entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created ProductCover.
 *       '400':
 *         description: Bad request, no file uploaded or invalid file format.
 *       '500':
 *         description: Internal server error.
 *     security:
 *       - bearerAuth: []  # Adjust or remove if you have authentication
 */



////////////
router.post("/login", Controller.login);
router.post("/register", Controller.register);
router.get('/logout', authenticateJWT, Controller.logout);

router.post("/blogs", authenticateJWT, Controller.createBlog);
router.get("/blogs", Controller.getBlogs);
router.post('/blogs/like/:blogId', authenticateJWT, Controller.likeBlog);
router.get("/blogs/oneblog/", authenticateJWT, Controller.getSingleBlog);

/////////////////
const uploadMiddleware= require("../middleware/productCoverMilddleware");
const { ro } = require('@faker-js/faker');


router.get("/products", Controller.products);
router.post("/addproduct",  Controller.addProduct);
router.post("/addproduct/cover", uploadMiddleware, Controller.uploadCover);
router.post("products/addfavourite/:productId", authenticateJWT, Controller.addFavourite);
router.get("products/oneproduct/:productId", Controller.oneProduct);

////////////////
router.use('api/v1/api-docs', swaggerUi.serve);
router.get('api/v1/api-docs', swaggerUi.setup(swaggerSpec));


module.exports=router;