const express = require('express');
let books = require("./booksdb.js"); // Books data
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Get the list of books available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
