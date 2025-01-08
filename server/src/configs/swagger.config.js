// Swagger configuration file
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookstore API',
      version: '1.0.0',
      description: "A simple Bookstore API using Node.JS, Express, MongoDB, and Redis. \n\nWelcome to the Bookstore API documentation. This API allows users to manage books and perform operations based on their roles. Features include user registration, login, role-based access control (RBAC), and CRUD operations on books. Redis is used for caching GET requests to optimize performance, and JWT authentication secures all endpoints.\n\nStart by registering a new user using the /signup endpoint, then log in with /signin to obtain a JWT token. Include this token in the Authorization header as a Bearer token for all other requests.\n\nAdmins can create new books with /books, update books with /books/{id}, and delete books with /books/{id}. Both Admins and regular Users can fetch all books using /books. The Swagger UI provides forms to input your request data and view responses, making it easy to interact with the API.",
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Path to your API route and model files
};

const specs = swaggerJsDoc(options);

module.exports = {
    specs,
    swaggerUI
};
