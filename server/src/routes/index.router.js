const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const AuthRouter = require('./auth.router');
const BookRouter = require('./book.router');

const Router = express.Router();

Router.get('/', (req, res) => {
    res.send({ 'message' : "Welcome to book store api" });
})

Router.use('/auth', AuthRouter);
Router.use('/books', verifyToken, BookRouter);

module.exports = Router;