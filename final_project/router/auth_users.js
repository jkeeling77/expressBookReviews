const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
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
  //console.log("IN:  POST /login");
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
  //console.log("IN:  PUT /auth/review/:isbn");
  const ISBN = req.params.isbn;
  const session_username = req.session.username;
  //console.log("  session_username["+session_username+"]");

  let filtered_book = books[ISBN];
  if(filtered_book) {
    let review = req.query.review;
    let reviewer = req.session.authorization['username'];
    //console.log("  review["+review+"], reviewer["+reviewer+"]");
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

regd_users.delete("/auth/review/:isbn", (req,res) => {
  //console.log("IN:  DELETE /auth/review/:isbn");
  const ISBN = req.params.isbn;
  const session_username1 = req.session.username;
  let session_username2 = req.session.authorization['username'];
  //console.log("session_username1["+session_username1+"], session_username2["+session_username2+"]");

  if(!session_username2){
     return res.status(401).json({message: "User not authenticated"});
  }

  if(books[ISBN]) {
    //let reviewer = req.session.authorization['username'];
    if(books[ISBN].reviews[session_username2]) {
        delete books[ISBN].reviews[session_username2];
        res.send("Book ISBN["+ISBN+"] User["+session_username2+"] review deleted");
    }
    else {
      res.send("Unable to locate review for username["+session_username2+"]");
    }
  }
  else {
    res.send("Unable to find book with ISBN["+ISBN+"]");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
