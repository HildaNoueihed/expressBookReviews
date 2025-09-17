const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const e = require('express');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let validUsers = users.filter(user => user.username === username);
  if(validUsers.length > 0){
      return true;
  }else{
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter(user => user.username === username && user.password === password);
  if(validUsers.length > 0){
      return true;
  }else{
      return false;
  }
  
}

regd_users.post("/register", (req,res) => {
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

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
      return res.status(404).json({message: "username and password are required!"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization['username'];
  let book = books[isbn];
  if(book){
      if(review){ 
          book.reviews[username] = review;
          books[isbn] = book;
          return res.status(200).json({message: "Review added/updated successfully"});
      }else{
          return res.status(404).json({message: "Review content is required"});
      }
  }else{
      return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  let book = books[isbn];
  if(book){
      if(book.reviews[username]){ 
          delete book.reviews[username];
          books[isbn] = book;
          return res.status(200).json({message: "Review deleted successfully"});
      }else{
          return res.status(404).json({message: "Review not found"});
      }
    }else{
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
