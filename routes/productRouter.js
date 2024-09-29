const express = require('express');
const productRouter = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const uploadMiddleware= require("../middleware/productCoverMilddleware");
const productController = require('../controllers/productController');
const userController=require("../controllers/userController");
const blogController=require("../controllers/blogController");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerConfig');

//////////////////////////////////
/**
 * @swagger
 * /products2:
 *   get:
 *     summary: Get a list of products
 *     description: Retrieves a list of products with optional pagination, sorting, and filtering.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: searchtext
 *         schema:
 *           type: string
 *         description: the text for search in products.
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category to filter products by. Must be a valid category path.
 *       - in: query
 *         name: exclusive
 *         schema:
 *           type: string
 *           enum: [1, ""]
 *         required: false
 *         description: When set to '1', filters products whose category path ends with the category path. If not provided, defaults to an empty string.
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
 * /products:
 *   get:
 *     summary: Get a list of products
 *     description: Retrieves a list of products with optional pagination, sorting, and filtering.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: searchtext
 *         schema:
 *           type: string
 *         description: the text for search in products.
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
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the category associated with the product.
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
 * /addproduct2:
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
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the category associated with the product.
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
/**
 * @swagger
 * /menu/bypath:
 *   get:
 *     summary: Retrieve the hierarchical structure of categories
 *     description: Fetches all categories and organizes them into a hierarchical structure based on their paths.
 *     responses:
 *       200:
 *         description: A hierarchical structure of categories organized by parent-child relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rootCategories:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the category
 *                       children:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: The name of the subcategory
 *     500:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Error message
 *     tags:
 *       - Categories
 */
/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Retrieve the hierarchical list of categories.
 *     description: Fetches all categories from the database and builds a hierarchical structure based on parent-child relationships.
 *     responses:
 *       200:
 *         description: A hierarchical structure of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier for the category.
 *                 name:
 *                   type: string
 *                   description: The name of the category.
 *                 children:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier for the child category.
 *                       name:
 *                         type: string
 *                         description: The name of the child category.
 *                       children:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: The unique identifier for the grandchild category.
 *                             name:
 *                               type: string
 *                               description: The name of the grandchild category.
 *     500:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Error message
 *     tags:
 *       - Categories
 */
/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Retrieve products based on category and exclusivity.
 *     description: Fetches products that belong to the specified category and optionally filters by exclusivity.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: The category to filter products by. Must be a valid category path.
 *       - in: query
 *         name: exclusive
 *         schema:
 *           type: string
 *           enum: [1, ""]
 *         required: false
 *         description: When set to '1', filters products whose category path ends with the category path. If not provided, defaults to an empty string.
 *     responses:
 *       '200':
 *         description: A list of products matching the filter criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the product.
 *                   name:
 *                     type: string
 *                     description: The name of the product.
 *       '400':
 *         description: Bad Request. Returned if the query parameters do not pass validation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The validation error message.
 *       '404':
 *         description: Not Found. Returned if the specified category does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message indicating that the category was not found.
 *       '500':
 *         description: Internal Server Error. Returned for unexpected errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *     tags:
 *       - Categories
 */

/**
 * @swagger
 * /productbyattr:
 *   get:
 *     summary: Get a list of products
 *     description: Retrieves a list of products based on the provided parameters.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to filter products.
 *       - in: query
 *         name: attributeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attribute to filter products.
 *       - in: query
 *         name: arrayvalues
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["s", "m", "l"]
 *         description: The values of the attribute to filter products.
 *     responses:
 *       200:
 *         description: A list of products matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       400:
 *         description: Bad request - Invalid parameters
 *       500:
 *         description: Internal server error
 */


/////////////////////////////////

productRouter.get("/products", productController.products);
productRouter.post("/addproduct",  productController.addProduct);
productRouter.post("/addproduct2", productController.addProduct2);
productRouter.post("/addproduct/cover", uploadMiddleware, productController.uploadCover);
productRouter.post("/products/addfavourite/:productId", authenticateJWT, productController.addFavourite);
productRouter.get("/products/oneproduct/:productId", productController.oneProduct);
productRouter.get("/products/favourites", authenticateJWT, productController.getFavourites);
productRouter.get("/products/search", productController.searchProducts);
productRouter.get("/products/filter", productController.filter);

productRouter.get("/products2", productController.products2);
productRouter.get("/menu/bypath", productController.menuByPass);
productRouter.get('/menu', productController.menu);

productRouter.get('/productbyattr', productController.productByAttribute);

////////////////
productRouter.use('api/v3/api-docs', swaggerUi.serve);
productRouter.get('api/v3/api-docs', swaggerUi.setup(swaggerSpec));


module.exports=productRouter;