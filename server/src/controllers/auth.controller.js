const mongoose = require('mongoose');
const { generateToken } = require('../middlewares/jwt.middleware');

const { User } = require('../models/');

// Function to register a new user
async function signupUser (req, res) {
    try {
        // Destructuring the fields from the request body
        const { name, email, password, role } = req.body;

        // Creating a new user with the provided details
        const user = await User.create({
            name: name,
            email: email,
            password: password,
            role: role
        });
        
        // Creating a payload for generating the token which contains the user ID
        const payload = {
            id: user._id,
            role: user.role
        };
        // generating the token using the payload
        const token = generateToken(payload);

        // If the user is created and the token is generated successfully
        if (user && token) {
            // responding with a 201 status code (Created) and a success message, token, and user's details
            return res.status(201).json({ 'message' : "User registration successful", token: token, user: user.name });
        } else {
            // else responding with a 500 status code (Internal Server Error) and an error message
            return res.status(500).json({ 'message' : "Some error occurred" });
        }
    } catch (error) {
        // If there is an error, responding with a 400 status code (Bad Request) and the error message
        return res.status(400).json({ 'message' : error.message });
    }
}

// Function to login an existing user 
async function signinUser (req, res) {
    try {
        // Destructuring the fields from the request body
        const { email, password } = req.body;

        // Finding a user with the provided email in the database
        const user = await User.findOne({ email: email });

        // If the user is not found or the password is incorrect
        if (!(user) || !(await user.comparePassword(password))) {
            // Responding with a 401 status code (Unauthorized) and an error message
            return res.status(401).json({ 'message' : "Invalid credentials" });
        }

        // Creating a payload for generating the token which contains the user ID
        const payload = {
            id: user.id,
            role: user.role
        }
        // Generating the token using the payload
        const token = generateToken(payload);

        // If the user is found and the token is generated successfully
        if (user && token) {
            // responding with a 200 status code (OK) and a success message, token, and user's details
            return res.status(200).json({ 'message' : "User login successful", token: token, user: user.name });
        } else {
            // else responding with a 500 status code (Internal Server Error) and an error message
            return res.status(500).json({ 'message' : "Some error occurred" });
        }
    } catch (error) {
        // If there is an error, responding with a 400 status code (Bad Request) and the error message
        return res.status(400).json({ 'message' : error.message });
    }
}

module.exports = {
    signupUser,
    signinUser
};