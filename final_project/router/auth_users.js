const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [ { username: "testuser", password: "password123" }];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, "secretKey", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Step 1: Extract and verify token from the Authorization header
    const token = req.headers.authorization;
     // Log the received token to check if it's being passed correctly
    console.log("Received token:", token);
    if (!token) return res.status(401).json({ message: "Unauthorized. Token missing." });

    try {
        // Step 2: Verify the token
        const decoded = jwt.verify(token.split(" ")[1], "secretKey");
        const username = decoded.username;

        // Step 3: Get the review from the request body and ISBN from URL parameter
        const { review } = req.body;
        const { isbn } = req.params;

        // Step 4: Validate ISBN format
        if (!isbn || isNaN(isbn) || !books[isbn]) {
            return res.status(404).json({ message: "Book not found with the given ISBN" });
        }

        // Step 5: Initialize reviews object if it doesn't exist
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        // Step 6: Add or update the review for the current book
        books[isbn].reviews[username] = review;

        // Step 7: Return success message
        return res.status(200).json({
            message: "Review added/updated successfully",
            reviews: books[isbn].reviews
        });

    } catch (error) {
        // Step 8: Handle errors (e.g., invalid token)
        return res.status(401).json({ message: "Invalid token or expired session." });
    }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], "secretKey");
        const username = decoded.username;
        const { isbn } = req.params;

        if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
            return res.status(404).json({ message: "No review found for this user on this book" });
        }

        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
