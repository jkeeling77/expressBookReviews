const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
   let userswithsamename = users.filter((user)=>{
      return user.username === username
   });

   if(userswithsamename.length > 0){
      return false;
   }
   else {
      return true;
   }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
  });

  if(validusers.length > 0){
    return true;
  }
  else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("IN:  POST /login");
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User["+username+"] successfully logged in");
  }
  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("IN:  PUT /auth/review/:isbn");
  const ISBN = req.params.isbn;
  const session_username = req.session.username;
  console.log("  session_username["+session_username+"]");

  let filtered_book = books[ISBN];
  if(filtered_book) {
    let review = req.query.review;
    let reviewer = req.session.authorization['username'];
    console.log("  review["+review+"], reviewer["+reviewer+"]");
    if(review) {
        filtered_book['reviews'][reviewer] = review;
        books[ISBN] = filtered_book;
        res.send("Book review added/updated");
    }
    else {
      res.send("Unable to update or add review: no review provided");
    }
  }
  else {
    res.send("Unable to find book with ISBN["+ISBN+"]");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
