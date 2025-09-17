const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "username and password are required!"});
  }
  if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"}); 
  }else{
      return res.status(404).json({message: "User already exists!"}); 
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let filteredBooks = books[isbn];
  if(filteredBooks){
      res.send(filteredBooks);
  }else{
      res.send({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filteredBooks = Object.values(books).filter(book => book.author === author);
  if(filteredBooks.length > 0){
      res.send(filteredBooks);
  }else{
      res.send({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = Object.values(books).filter(book => book.title === title);
  if(filteredBooks.length > 0){
      res.send(filteredBooks);
  }else{
      res.send({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let filteredBooks = books[isbn];
  res.send(filteredBooks.filter(book => {
    if (book.isbn === isbn){
       return book.reviews; 
    } 
  }));
});

module.exports.general = public_users;
