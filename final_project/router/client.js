const axios = require('axios');

// Task 10: Get the list of books available in the shop
async function getBooks() {
    try {
        const response = await axios.get('http://localhost:3000'); // API endpoint for all books
        console.log("List of Books:", response.data);
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
}

// Task 11: Get book details based on ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:3000/isbn/${isbn}`); // API endpoint for book by ISBN
        console.log(`Book details for ISBN ${isbn}:`, response.data);
    } catch (error) {
        console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    }
}

// Task 12: Get book details based on Author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:3000/author/${author}`); // API endpoint for books by author
        console.log(`Books by author ${author}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
    }
}

// Task 13: Get book details based on Title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:3000/title/${title}`); // API endpoint for books by title
        console.log(`Books with title ${title}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books with title ${title}:`, error.message);
    }
}

// Call functions to test
getBooks(); // Task 10
getBookByISBN('1'); // Task 11, example ISBN
getBooksByAuthor('Chinua Achebe'); // Task 12, example author
getBooksByTitle('Things Fall Apart'); // Task 13, example title
