const express = require('express');
const productRouter = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const uploadMiddleware= require("../middleware/productCoverMilddleware");
const productController = require('../controllers/productController');
const userController=require("../controllers/userController");
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
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: The ID of the category to filter products.
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
 *         name: attributeId
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: The ID of the attribute to filter products.
 *       - in: query
 *         name: arrayvalues
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: The values of the attribute to filter products.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: maximum price
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
 * /products/{productId}:
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
 *           type: integer  
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
 *           type: array
 *           items:
 *             type: integer
 *         description: The ID of the category to filter products.
 *       - in: query
 *         name: attributeId
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
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
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: maximum price
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

/**
 * @swagger
 * /attributesofcategory:
 *   get:
 *     summary: Retrieve attributes by category
 *     description: Returns a list of attributes for a specific category, including the attribute details.
 *     tags:
 *       - Attributes
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the category to retrieve attributes for
 *     responses:
 *       200:
 *         description: A list of attributes for the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The attribute ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the attribute
 *                     example: Color
 *                   attribute:
 *                     type: object
 *                     description: Details of the attribute
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the attribute
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The name of the attribute
 *                         example: Color
 *       400:
 *         description: Bad Request - Invalid or missing categoryId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message detailing what went wrong
 *                   example: "categoryId must be a number."
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /newAttribute:
 *   post:
 *     summary: Add a new attribute
 *     description: Creates a new attribute with the provided name.
 *     tags: 
 *       - Attributes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attributeName
 *             properties:
 *               attributeName:
 *                 type: string
 *                 description: Name of the attribute to be added.
 *                 example: Color
 *     responses:
 *       201:
 *         description: Attribute created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the newly created attribute.
 *                 name:
 *                   type: string
 *                   description: Name of the newly created attribute.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /updateattribute:
 *   patch:
 *     summary: Update an existing attribute
 *     description: Updates the name of an existing attribute based on its ID.
 *     tags: 
 *       - Attributes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attributeId
 *               - newName
 *             properties:
 *               attributeId:
 *                 type: integer
 *                 description: ID of the attribute to be updated.
 *                 example: 1
 *               newName:
 *                 type: string
 *                 description: New name for the attribute.
 *                 example: Size
 *     responses:
 *       200:
 *         description: Attribute updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: Number of rows affected (should be 1 if successful).
 *                 message:
 *                   type: string
 *                   description: Update result message.
 *                   example: "Attribute updated successfully."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /addAttributevalue:
 *   post:
 *     summary: Add a new attribute value to a category
 *     description: Creates a new attribute value associated with a specific attribute and category.
 *     tags: 
 *       - Attributes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attributeId
 *               - categoryId
 *               - thevalue
 *             properties:
 *               attributeId:
 *                 type: integer
 *                 description: The ID of the attribute.
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the category.
 *                 example: 2
 *               thevalue:
 *                 type: string
 *                 description: The value of the attribute to be added.
 *                 example: "Red"
 *     responses:
 *       201:
 *         description: Attribute value created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created attribute value.
 *                 attributeId:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *                 value:
 *                   type: string
 *                   description: The value of the newly created attribute.
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: "categoryId must be an integer."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /addnewcategory:
 *   post:
 *     summary: Add a new category
 *     description: Creates a new category. A category may have an optional parent category.
 *     tags: 
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: "Electronics"
 *               parentId:
 *                 type: integer
 *                 description: The ID of the parent category (optional).
 *                 example: 1
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created category.
 *                 name:
 *                   type: string
 *                   description: Name of the new category.
 *                 parentId:
 *                   type: integer
 *                   description: The ID of the parent category (if any).
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: "name is required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /addattributevaluetoproduct:
 *   post:
 *     summary: Add an attribute value to a product
 *     description: Adds an attribute value to a specific product by providing the `productId` and `attributeValueId`, and then returns the updated product information.
 *     tags: 
 *       - Attributes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product
 *                 example: 1
 *               attributeValueId:
 *                 type: integer
 *                 description: The ID of the attribute value to add to the product
 *                 example: 10
 *     responses:
 *       200:
 *         description: Successfully added the attribute value and returned the updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The product ID
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The product name
 *                   example: "Sample Product"
 *                 categories:
 *                   type: object
 *                   description: The category information of the product
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the category
 *                       example: "Electronics"
 *                     parent:
 *                       type: object
 *                       description: The parent category
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The name of the parent category
 *                           example: "Devices"
 *                 attributeValues:
 *                   type: array
 *                   description: List of attribute values of the product
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The attribute value ID
 *                         example: 10
 *                       value:
 *                         type: string
 *                         description: The attribute value
 *                         example: "Blue"
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid input data"
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
 *                   example: "An error occurred while adding the attribute value"
 */


/**
 * @swagger
 * /cache:
 *   get:
 *     summary: Retrieve categories, either from cache or the database
 *     description: This endpoint attempts to retrieve categories from a cache. If no cached data is found, it fetches the categories from the database and then caches the result for future requests.
 *     responses:
 *       200:
 *         description: Successfully retrieved categories from cache or database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The category ID
 *                   name:
 *                     type: string
 *                     description: The category name
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
 */

/**
 * @swagger
 * /updatecategory:
 *   patch:
 *     summary: Update a category by ID
 *     description: Updates the name and parent category of an existing category by `categoryId`. If the category is cached, it retrieves the cached category, otherwise, it fetches it from the database.
 *     tags: 
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category
 *               parentId:
 *                 type: integer
 *                 description: The ID of the new parent category
 *               categoryId:
 *                 type: integer
 *                 required : true
 *                 description: The ID of the category to be updated
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated category
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The updated name of the category
 *                   example: "Updated Category Name"
 *                 parentId:
 *                   type: integer
 *                   description: The updated parent category ID
 *                   example: 2
 *       400:
 *         description: Bad request, invalid or missing input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Category not found"
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
 *                   example: "An error occurred while updating the category"
 */

/**
 * @swagger
 * /products/{productId}/history:
 *   get:
 *     summary: Get the update history of a product.
 *     description: Retrieve all the previous versions (update history) of a product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product whose update history you want to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the update history of the product.
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
 *                   productId:
 *                     type: integer
 *                     example: 1
 *                   version:
 *                     type: integer
 *                     example: 2
 *                   changes:
 *                     type: object
 *                     description: Object containing the details of the changes made in the specific version.
 *                     example: { "product": { "title": "New Title", "price": 99.99 }, "category": { "categoryId": 2 } }
 *       400:
 *         description: Invalid productId or product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */



/**
 * @swagger
 * /products/update:
 *   patch:
 *     summary: Update a product's details, including title, description, price, cover, and category.
 *     description: Updates a product's information. If the product exists, it updates the relevant fields and increments the product's version.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product to update.
 *                 example: 1
 *               title:
 *                 type: string
 *                 description: New title of the product.
 *                 example: "Updated Product Title"
 *               description:
 *                 type: string
 *                 description: New description of the product.
 *                 example: "Updated product description."
 *               price:
 *                 type: number
 *                 description: New price of the product. Must be positive.
 *                 example: 200.00
 *               coverId:
 *                 type: integer
 *                 description: ID of the new product cover.
 *                 example: 2
 *               categoryId:
 *                 type: integer
 *                 description: ID of the new category to assign the product to.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully updated the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *       400:
 *         description: Invalid request parameters (validation error).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "productId must be an integer."
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /products/{productId}/history/{productVersionId}/reverse:
 *   put:
 *     summary: Reverse a product to a previous version.
 *     description: Reverts the product to a previous version using the productVersionId.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the product to revert.
 *       - in: path
 *         name: productVersionId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: The ID of the version to revert the product to.
 *     responses:
 *       200:
 *         description: Successfully reverted the product to the specified version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product successfully reverted to version."
 *                 product:
 *                   type: object
 *                   description: The updated product after the version reversal.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Reverted Product Name"
 *                     price:
 *                       type: number
 *                       example: 100.0
 *       400:
 *         description: Bad request due to invalid productId or productVersionId format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "productId must be an integer or productVersionId must be an integer."
 *       404:
 *         description: Product or product version not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This version not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /scrape:
 *   post:
 *     summary: Scrape a webpage for titles and descriptions
 *     description: Scrapes the provided URL for all links' titles and meta descriptions, and saves the data in the database.
 *     tags:
 *       - Scraping
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the page to scrape.
 *                 example: "https://www.example.com"
 *     responses:
 *       200:
 *         description: Successfully scraped and saved titles and descriptions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique ID of the scrape record.
 *                   example: 1
 *                 url:
 *                   type: string
 *                   description: The URL that was scraped.
 *                   example: "https://www.example.com"
 *                 titles:
 *                   type: object
 *                   description: An object containing all the scraped titles from links.
 *                   example: {
 *                     "titles": ["Home", "About Us", "Contact"]
 *                   }
 *                 descriptions:
 *                   type: object
 *                   description: An object containing the meta description of the page.
 *                   example: {
 *                     "descriptions": "This is a sample meta description."
 *                   }
 *       400:
 *         description: Invalid URL format or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "url must be a string."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /scrape:
 *   get:
 *     summary: Get a list of previously scraped URLs and their titles/descriptions
 *     description: Retrieves a list of all URLs that have been scraped, along with their titles and meta descriptions.
 *     tags:
 *       - Scraping
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *           description: The specific URL to filter the results.
 *         required: false
 *         description: The URL to filter the scraped data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of scrapes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the scrape record.
 *                     example: 1
 *                   url:
 *                     type: string
 *                     description: The URL that was scraped.
 *                     example: "https://www.example.com"
 *                   titles:
 *                     type: object
 *                     description: An object containing all the scraped titles from links.
 *                     example: {
 *                       "titles": ["Home", "About Us", "Contact"]
 *                     }
 *                   descriptions:
 *                     type: object
 *                     description: An object containing the meta description of the page.
 *                     example: {
 *                       "descriptions": "This is a sample meta description."
 *                     }
 *       400:
 *         description: Invalid URL format or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "url must be a string."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */



/////////////////////////////////

productRouter.get("/products", productController.products);
productRouter.post("/addproduct",  productController.addProduct);
productRouter.post("/addproduct2", productController.addProduct2);
productRouter.post("/addproduct/cover", uploadMiddleware, productController.uploadCover);
productRouter.post("/products/addfavourite/:productId", authenticateJWT, productController.addFavourite);
productRouter.get("/products/:productId/history", productController.listUpdateHistory);
productRouter.put("/products/:productId/history/:productVersionId/reverse", productController.reverseVersion);
productRouter.get("/products/:productId", productController.oneProduct);
productRouter.get("/products/favourites", authenticateJWT, productController.getFavourites);
productRouter.get("/products/search", productController.searchProducts);
productRouter.get("/products/filter", productController.filter);
productRouter.get('/productbyattr', productController.productByAttribute);
productRouter.patch('/products/update', productController.updateProduct);

productRouter.get("/products2", productController.products2);
productRouter.get("/menu/bypath", productController.menuByPass);
productRouter.get('/menu', productController.menu);


productRouter.get('/attributesofcategory',productController.getAttributesByCategory);
productRouter.post('/newAttribute', productController.addNewAttribute);
productRouter.patch('/updateattribute', productController.updateAttribute);
productRouter.post('/addAttributevalue', productController.addAttributeValue);
productRouter.post('/addnewcategory', productController.addCategory);
productRouter.post('/addattributevaluetoproduct', productController.addAttributeValueToProduct);
productRouter.patch('/updatecategory', productController.updateCategory);


productRouter.post('/scrape', productController.scrape);
productRouter.get('/scrape', productController.listScrapes);

productRouter.get('/cache', productController.caching);


////////////////
productRouter.use('api/v3/api-docs', swaggerUi.serve);
productRouter.get('api/v3/api-docs', swaggerUi.setup(swaggerSpec));




module.exports=productRouter;