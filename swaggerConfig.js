const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TEST API',
    version: '1.0.0',
    description: 'Simple TEST API',     
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1/',
      description: 'Development server',
    },
    {
      url: 'http://localhost:3000/api/v2/',
      description: 'Development server',
    },
    {
      url: 'http://localhost:3000/api/v3/',
      description: 'Development server',
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional: if you're using JWT tokens
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  // paths to files containing OpenAPI definitions
  apis: ['./routes/productRouter.js',
  './routes/userRouter.js',
  './routes/router.js',],
   
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
