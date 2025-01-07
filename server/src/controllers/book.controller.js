const mongoose = require('mongoose');
const getRedisClient = require('../configs/redis.config');

const { Book } = require('../models/');

// Function to create a new Book
async function createBook(req, res) {
    // Checking if the user is an admin
    if (req.user && req.user.role === "Admin") {
        try {
            // Destructuring the fields from the request body
            const { title, description, author, publishedDate, genre } = req.body;

            // Creating a new book with the provided details
            const newBook = await Book.create({
                title: title,
                description: description,
                author: author,
                publishedDate: publishedDate,
                genre: genre
            });

            // If the book is created successfully
            if (newBook) {
                return res.status(201).json({
                    'message': "New book created successfully",
                    'book': newBook
                });
            } else {
                return res.status(500).json({ message: "Some error occurred" });
            }
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    } else {
        return res.status(401).json({ message: "Only admins can create a book" });
    }
}

// Function to get all the books
async function getAllBooks(req, res) {
    try {
      const cacheKey = 'books'; // Defining a cache key
      const redisClient = await getRedisClient(); // Get the Redis client instance
  
      // Check if data exists in the Redis cache
      const cachedData = await redisClient.get(cacheKey);
  
      if (cachedData) {
        // If data is found in cache, return it
        return res.status(200).json({
          'message': "Books fetched successfully",
          'source': "Cache",
          'books': JSON.parse(cachedData),
        });
      }
  
      // If not in cache, fetch data from the database
      const books = await Book.find();
  
      if (books.length > 0) {
        // Store the result in Redis with a 60-second expiration
        await redisClient.set(cacheKey, JSON.stringify(books), { EX: 60 });
  
        return res.status(200).json({
          'message': "Books fetched successfully",
          'source': "Database",
          'books': books,
        });
      } else {
        return res.status(404).json({ 'message': "No books found" });
      }
    } catch (error) {
      return res.status(500).json({ 'message': "Internal Server Error", error: error.message });
    }
  }

// Function to get details of a single book by id
async function getBookById(req, res) {
    try {
        // Extracting the book ID from the request params
        const { id } = req.params;

        // Fetching the book by its ID from the database
        const book = await Book.findById(id);

        // If the book is found, responding with the book details
        if (book) {
            return res.status(200).json({
                'message': "Book fetched successfully",
                'book': book
            });
        } else {
            return res.status(404).json({ 'message': "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ 'message': "Some error occurred" });
    }
}

// Function to update a book by ID
async function updateBookById(req, res) {
    try {
        // Extracting the book ID from the request params and the updated fields from the body
        const { id } = req.params;
        const { title, description, author, publishedDate, genre } = req.body;

        // Finding the book by its ID and updating it with the provided fields
        const updatedBook = await Book.findByIdAndUpdate(id, {
            title: title,
            description: description,
            author: author,
            publishedDate: publishedDate,
            genre: genre
        }, { new: true });  // 'new' option returns the updated document

        // If the book is found and updated
        if (updatedBook) {
            return res.status(200).json({
                'message': "Book updated successfully",
                'book': updatedBook
            });
        } else {
            return res.status(404).json({ 'message': "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ 'message': "Some error occurred" });
    }
}

async function deleteBookById(req, res) {
    try {
        // Extracting the book ID from the request params
        const { id } = req.params;

        // Finding and deleting the book by its ID
        const deletedBook = await Book.findByIdAndDelete(id);

        // If the book is found and deleted
        if (deletedBook) {
            return res.status(200).json({
                'message': "Book deleted successfully",
                'book': deletedBook
            });
        } else {
            return res.status(404).json({ 'message': "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ 'message': "Some error occurred" });
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById
};