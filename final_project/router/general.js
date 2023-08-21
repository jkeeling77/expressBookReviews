const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "/register endpoint: Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "/ endpoint: Yet to be implemented"});
  res.send(JSON.stringify({books},null,4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;
   let book;
   for(key in books) {
      if(key == isbn) {
         book = books[key];
         break;
      }
   }

   if( book ) {
      res.send(JSON.stringify(book));
   }
   else {
      res.send("Book with ISBN["+isbn+"] not found");
   }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const author = req.params.author;
   const ISBNs = Object.keys(books);

   let booksbyauthor = [];
   ISBNs.forEach( (ISBN) => {
      if(books[ISBN].author === author) {
         booksbyauthor.push({"isbn":ISBN,
                              "title":books[ISBN].title,
                              "reviews":books[ISBN].reviews
                            });
      }
   });

   if( booksbyauthor.length > 0 ) {
      res.send(booksbyauthor);
   }
   else {
      res.send("Books by author["+author+"] not found");
   }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title;
   const ISBNs = Object.keys(books);

   let book;
   ISBNs.forEach( (ISBN) => {
      if(books[ISBN].title === title) {
         book = books[ISBN];
      }
   });

   if( book ) {
      res.send(JSON.stringify(book));
   }
   else {
      res.send("Book with title["+title+"] not found");
   }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const ISBN = req.params.isbn; 
   console.log("IN: get(/review/:isbn, isbn["+ISBN+"]");
   let reviews;
   for(key in books) {
      if(key == ISBN) {
         console.log("key["+key+"] == ISBN["+ISBN+"]");
         console.log("books[key].title:  " +books[key].title);
         console.log("books[key].author: " +books[key].author);
         console.log("books[key].reviews: " +books[key].reviews);
         reviews = books[key].reviews;
         console.log("Array.isArray(reviews):" + Array.isArray(reviews));
         break;
      }
   }

   if(reviews) {
      res.send(JSON.stringify(reviews));
   }
   else {
      res.send("Book Reviews for ISBN["+ISBN+"] not found");
   }

  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
