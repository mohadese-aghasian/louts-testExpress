const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const uploadMiddleware= require("../middleware/productCoverMilddleware");
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
/////////////////////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of products
 *     description: Retrieves a list of products with optional pagination, sorting, and filtering.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of products to return.
 *       - in: query
 *         name: start
 *         schema:
 *           type: integer
 *         description: The starting index of the products to return.
 *       - in: query
 *         name: orderby
 *         schema:
 *           type: string
 *           enum: [title, createdAt, updatedAt, id, price, description]
 *           default: id
 *           example: id
 *         description: The column by which to sort the products.
 *       - in: query
 *         name: orderdir
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *           example: ASC
 *         description: The direction in which to sort the products (ascending or descending).
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
 *                     description: The unique identifier of the product.
 *                   title:
 *                     type: string
 *                     description: The title of the product.
 *                   description:
 *                     type: string
 *                     description: The content or description of the product.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the product was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the product was last updated.
 *                   price:
 *                     type: integer
 *                     description: price of product.
 *       400:
 *         description: Bad request - Invalid format for query parameters
 *       500:
 *         description: Internal server error - An error occurred while retrieving the products
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
 *           type: string
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
 *                 description: The cover image file (JPEG, JPG, PNG, GIF)
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
/**
 * @swagger
 * /products/oneproduct/{productId}:
 *   get:
 *     summary: Retrieve a specific product by its ID
 *     description: Fetches the details of a single product using its unique ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string  # Assuming ID is passed as a string of digits
 *         description: The unique ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier of the product
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 description:
 *                   type: string
 *                   description: A detailed description of the product
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: The price of the product
 *                 # Include any other relevant product properties
 *               example:
 *                 id: 1
 *                 name: Example Product
 *                 description: A detailed description of the example product.
 *                 price: 29.99
 *       400:
 *         description: Bad request due to invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid format, id must be an integer!
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
 */
/**
 * @swagger
 * /products/favourites:
 *   get:
 *     summary: Get user's favourite products
 *     description: Retrieves a list of favourite products for the authenticated user.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of favourite products for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the favourite product.
 *                   userId:
 *                     type: integer
 *                     description: The user ID associated with the favourite product.
 *                   productId:
 *                     type: integer
 *                     description: The product ID of the favourite product.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the favourite was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the favourite was last updated.
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Internal server error - An error occurred while retrieving the favourites.
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search for products by title or description
 *     description: Retrieves a list of products where either the title or description contains the search terms provided in the query parameters.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: The title to search for within the product titles. Supports substring matching.
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: The description to search for within the product descriptions. Supports substring matching.
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the product.
 *                   title:
 *                     type: string
 *                     description: The title of the product.
 *                   description:
 *                     type: string
 *                     description: The description of the product.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the product was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the product was last updated.
 *       400:
 *         description: Bad Request - The query parameters provided are invalid.
 *       500:
 *         description: Internal Server Error - An error occurred while retrieving products.
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

router.get("/products", Controller.products);
router.post("/addproduct",  Controller.addProduct);
router.post("/addproduct/cover", uploadMiddleware, Controller.uploadCover);
router.post("/products/addfavourite/:productId", authenticateJWT, Controller.addFavourite);
router.get("/products/oneproduct/:productId", Controller.oneProduct);
router.get("/products/favourites", authenticateJWT, Controller.getFavourites);
router.get("/products/search", Controller.searchProducts);

////////////////
router.use('api/v1/api-docs', swaggerUi.serve);
router.get('api/v1/api-docs', swaggerUi.setup(swaggerSpec));


module.exports=router;