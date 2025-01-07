const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *           example: The Great Gatsby
 *         description:
 *           type: string
 *           description: A brief summary of the book
 *           example: A novel set in the Roaring Twenties about the mysterious Jay Gatsby.
 *         author:
 *           type: string
 *           description: The name of the author
 *           example: F. Scott Fitzgerald
 *         publishedDate:
 *           type: string
 *           format: date
 *           description: The date the book was published
 *           example: 1925-04-10
 *         genre:
 *           type: string
 *           description: The genre of the book
 *           example: Fiction
 *       example:
 *         title: The Great Gatsby
 *         description: A novel set in the Roaring Twenties about the mysterious Jay Gatsby.
 *         author: F. Scott Fitzgerald
 *         publishedDate: 1925-04-10
 *         genre: Fiction
 */
const BookSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    author : {
        type: String,
        required: true
    },
    publishedDate : {
        type: Date
    },
    genre : {
        type: String
    }
}, {
    timestamps: true
});

const BookModel = mongoose.model('Book', BookSchema);
module.exports = BookModel;