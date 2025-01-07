const express = require('express');

const AdminCheck = require('../middlewares/rbac.middleware');

const {
    createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById
} = require('../controllers/book.controller');

const BookRouter = express.Router();

// Route for creating new book (Admin only)
/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     description: Allows admin users to create a new book in the system.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book
 *                 example: "The Great Gatsby"
 *               description:
 *                 type: string
 *                 description: A short description of the book
 *                 example: "A novel by F. Scott Fitzgerald."
 *               author:
 *                 type: string
 *                 description: The author of the book
 *                 example: "F. Scott Fitzgerald"
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 description: The publication date of the book
 *                 example: "1925-04-10"
 *               genre:
 *                 type: string
 *                 description: The genre of the book
 *                 example: "Fiction"
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New book created successfully"
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized access, only admins can create a book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred"
 *       400:
 *         description: Bad request, invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
BookRouter.post('/', AdminCheck, createBook);

// Route to fetch all the books
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Fetch all books
 *     tags: [Books]
 *     description: Fetches a list of all books, available for both admin and regular users.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Books fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Books fetched successfully"
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       404:
 *         description: No books found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No books found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred"
 */
BookRouter.get('/', getAllBooks);

// Route to fetch details of a single book
/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Fetch a book by ID
 *     tags: [Books]
 *     description: Fetches the details of a specific book by its ID, available for both admin and regular users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to fetch
 *         schema:
 *           type: string
 *           example: 60b8a4c20b9f6f001f88e9b0
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Book fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book fetched successfully"
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred"
 */
BookRouter.get('/:id', getBookById);

// Route to update a book by ID (Admin only)
/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     description: Allows admin users to update the details of a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to update
 *         schema:
 *           type: string
 *           example: 60b8a4c20b9f6f001f88e9b0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the book
 *                 example: "The Great Gatsby - Updated"
 *               description:
 *                 type: string
 *                 description: The updated description of the book
 *                 example: "An updated version of the novel by F. Scott Fitzgerald."
 *               author:
 *                 type: string
 *                 description: The updated author of the book
 *                 example: "F. Scott Fitzgerald"
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 description: The updated publication date of the book
 *                 example: "1925-04-10"
 *               genre:
 *                 type: string
 *                 description: The updated genre of the book
 *                 example: "Fiction"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book updated successfully"
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found"
 *       401:
 *         description: Unauthorized access, only admins can update a book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred"
 */
BookRouter.put('/:id', AdminCheck, updateBookById);

// Route to delete a book by ID (Admin only)
/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     description: Allows admin users to delete a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to delete
 *         schema:
 *           type: string
 *           example: 60b8a4c20b9f6f001f88e9b0
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found"
 *       401:
 *         description: Unauthorized access, only admins can delete a book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Some error occurred"
 */
BookRouter.delete('/:id', AdminCheck, deleteBookById);

module.exports = BookRouter;