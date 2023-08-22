const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
   //console.log("IN:  POST /register");
   const username = req.query.username;
   const password = req.query.password;
 
   if (username && password) {
     if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User["+username+"] successfully registred. Now you can login"});
     }
     else {
        return res.status(404).json({message: "User["+username+"] already exists!"});    
     }
   }
   else {
      if(!username) {
         return res.status(404).json({message: "Username not provided."});
      }
      else if(!password) {
         return res.status(404).json({message: "Password not provided."});
      }
   }
   return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Replaced by task 10
/*
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});
*/

// Get book details based on ISBN, replaced by task 10
/*
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
*/

// Get book details based on author
// replaced by task 12
/*
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
*/

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
   if(books[ISBN]){
      res.send(books[ISBN]["reviews"]);
   }
   else {
      res.send("Book with ISBN["+ISBN+"] not found");
   }
});

// task 10
public_users.get('/', function(req,res) {
  const get_books = new Promise( (resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
    });
});

// task 11
public_users.get('/isbn/:isbn', function(req,res) {
  console.log("IN:  GET /isbn/:isbn");
  const get_isbn = new Promise((resolve, reject) => {
    ISBN = req.params.isbn;
    let book;
    for( key in books) {
       if(key == ISBN) {
          book = books[key];
          break;
       }
    }
    
    if(book) {
       res.send(JSON.stringify({book}, null, 4));
    }
    else {
       res.send("Book with ISBN["+ISBN+"] not found");
    }
  });
 });

 // task 12
 public_users.get('/author/:author', function(req,res) {
  console.log("IN:  GET /author/:author");
  console.log("author[" +req.params.author+"]");
  const get_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let ISBNs = Object.keys(books);

    ISBNs.forEach((ISBN) => {
      if(books[ISBN]["author"] === req.params.author) {
         booksbyauthor.push({"isbn":ISBN,
                             "title":books[ISBN]["title"],
                             "reviews":books[ISBN]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbyauthor}, null, 4));
  });
 });


module.exports.general = public_users;
