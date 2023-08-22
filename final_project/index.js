const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    console.log("IN: /customer/auth/*");
    let token = req.session.authorization;
    if(token) {
        token = token['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({message: "Customer not authenticated"});
            }
        });
    }
    else {
        return res.status(403).json({message: "Customer not logged in"});
    }

    /*
    if(req.session.authorization) {     //get authorization object stored in session
        token = req.session.authorization['accessToken']; //retrieve token from authorization object
        jwt.verify(token, "access",(err,user)=>{ //Use JWT to verify token
            if(!err){
                console.log("user["+user+"] authenticated");
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"});
            }
         });
    }
    else {s
         return res.status(403).json({message: "User not logged in"});
    }
    */
//Write the authenication mechanism here
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
