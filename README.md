# Bookstore API

The Bookstore API is a backend application built with Node.js, Express, MongoDB, and Redis. It provides endpoints for user authentication and book management. Key features include rate limiting, caching with Redis, and role-based access control (RBAC) for secure operations.

---

## Features

- **User Authentication**: Register and login functionality with JWT tokens.
- **Book Management**: Create, fetch, update, and delete books.
- **Rate Limiting**: Prevent abuse by limiting the number of requests per minute.
- **Caching**: Improve performance using Redis to cache book data.
- **RBAC**: Restrict access to certain operations based on user roles (Admin/User).

---

## Setup and Run the API

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Steps to Set Up and Run

1. **Clone the Repository**
   ```bash
   git clone https://github.com/udayakiranchhotaraya/squbix-book-store.git
   cd server
   ```

2. **Set up environment variables**: The .env file in the root of the project is already configured and ready

3. **Start the Application Using Docker Compose**
   Ensure Docker is running, then execute:
   ```bash
   docker-compose up --build
   ```
   This will start the Node.js app, MongoDB, and Redis in a Docker network.

   The application should now be running on `http://localhost:5000`.

   To close the application use:
   ```bash
   docker-compose down -v
   ```

5. **Access the API**
   - Base URL: `http://localhost:5000`
   - API Documentation: `http://localhost:5000/api-docs`

---

## API Documentation

### User Endpoints

#### Register a User
**POST** `/api/user/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - `201 Created`: User registered successfully with a JWT token.
  - `400 Bad Request`: Missing or invalid fields.

#### Login a User
**POST** `/api/user/login`
- **Description**: Log in an existing user.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - `200 OK`: User logged in successfully with a JWT token.
  - `401 Unauthorized`: Invalid credentials.

#### Fetch User Profile
**GET** `/api/user/profile`
- **Description**: Fetch the authenticated user’s profile.
- **Headers**:
  - `Authorization`: `Bearer <JWT>`
- **Response**:
  - `200 OK`: User profile details.
  - `401 Unauthorized`: Missing or invalid token.

### Book Endpoints

#### Create a Book
**POST** `/api/books`
- **Description**: Add a new book (Admin only).
- **Headers**:
  - `Authorization`: `Bearer <JWT>`
  - `x-role`: `Admin`
- **Request Body**:
  ```json
  {
    "title": "Book Title",
    "description": "A great book",
    "author": "Author Name",
    "genre": "Fiction",
    "publishedDate": 1929-11-07
  }
  ```
- **Response**:
  - `201 Created`: Book added successfully.
  - `403 Forbidden`: Access Denied.
  - `400 Bad Request`: Missing fields.

#### Fetch All Books
**GET** `/api/books`
- **Description**: Fetch all books.
- **Implementation**: The controller checks Redis for cached data. If no cache exists, the data is fetched from MongoDB, cached in Redis for 60 seconds, and then returned.
- **Response**:
  - `200 OK`: List of books from the cache or database.

#### Fetch Book by ID
**GET** `/api/books/:id`
- **Description**: Fetch a specific book by its ID.
- **Response**:
  - `200 OK`: Book details.
  - `404 Not Found`: Book not found.

#### Update a Book
**PUT** `/api/books/:id`
- **Description**: Update a book by ID (Admin only).
- **Headers**:
  - `Authorization`: `Bearer <JWT>`
  - `x-role`: `Admin`
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description"
  }
  ```
- **Response**:
  - `200 OK`: Book updated successfully.
  - `403 Forbidden`: Access Denied.

#### Delete a Book
**DELETE** `/api/books/:id`
- **Description**: Delete a book by ID (Admin only).
- **Headers**:
  - `Authorization`: `Bearer <JWT>`
  - `x-role`: `Admin`
- **Response**:
  - `200 OK`: Book deleted successfully.
  - `403 Forbidden`: Access Denied.

---

## Key Features Implementation

### 1. Rate Limiting
- **Purpose**: Prevent abuse by limiting the number of API requests per user.
- **Implementation**:
  - Middleware: `express-rate-limit`.
  - Configuration: Allows a maximum of 10 requests per minute per user, identified by the `x-user-id` header.

### 2. Caching
- **Purpose**: Improve performance by storing and serving data from Redis instead of querying the database repeatedly.
- **Implementation**:
  - The caching logic is implemented directly in the controllers.
  - Example for fetching books:
    ```javascript
    const redisClient = require('./config/redis');

    async function getAllBooks(req, res) {
      const cacheKey = 'books';
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        return res.status(200).json({ source: 'cache', data: JSON.parse(cachedData) });
      }

      const books = await Book.find();
      await redisClient.set(cacheKey, JSON.stringify(books), { EX: 60 });
      return res.status(200).json({ source: 'database', data: books });
    }
    ```

### 3. Role-Based Access Control (RBAC)
- **Purpose**: Restrict certain operations (e.g., creating or deleting books) to specific roles (Admin only).
- **Implementation**:
  - Middleware checks the `x-role` header or the JWT payload for the user’s role.

---

## Testing

- **Tools Used**:
  - Jest for unit testing.
  - MongoDB Memory Server to avoid affecting the production database.
  - Supertest for API endpoint testing.

- **Run Tests**:
  ```bash
  npm test
  ```

---

For further details or issues, feel free to contact the developer team!

