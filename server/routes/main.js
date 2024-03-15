// Import required modules and libraries
const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
   // Middleware setup for parsing URL-encoded bodies
routes.use(express.urlencoded({ extended: true }));

// Import the Users model from the database module
const { Users } = require('../database.js');

// Connect to MongoDB
try {
    mongoose.connect("mongodb://localhost/Jobfinder").then(() => {
        console.log("connected");
    });
} catch (ex) {
    // Handle MongoDB connection error
    next(ex);
}

// Render login page
routes.get('/', (req, res) => {
    res.render('login', { keyword: undefined });
});

// Handle user login
routes.post('/login', async (req, res) => {
    try {
        // Find user by email in the database
        const user = await Users.findOne({ email: req.body.email });

        // Check if user exists
        if (!user) {
            res.render('login',{keyword:true});
        }

        // Compare password with hashed password stored in the database
        const valid = await bcrypt.compare(req.body.password, user.password);

        // Verify JWT token associated with the user
        const name = jwt.verify(user.token, config.get('jwtprivatekey'));

        // If password is valid and token is verified, generate a new token and render login page
        if (valid && name.email == req.body.email) {
            const token = jwt.sign({ email: req.body.email }, config.get('jwtprivatekey'));
            res.header('x-auth-token', token).render('login', { token,keyword:false });
        } else {
            res.render('login',{keyword:true});
        }
    } catch (ex) {
        // Handle exceptions
        console.log(ex.message);
    }
});
// Render sign-up page
routes.get('/signup', (req, res) => {
    res.render('signup', { userrr: false });
});

// Handle user sign-up
routes.post('/signup', async (req, res) => {
    try {
        // Check if the email already exists in the database
        const existingUser = await Users.findOne({ email: req.body.email });

        // If email doesn't exist, create a new user
        if (!existingUser) {
            const token = jwt.sign({ email: req.body.email }, config.get('jwtprivatekey'));
            const user = await new Users({
                email: req.body.email,
                password: req.body.password,
                token: token
            });

            // Hash the password before saving to the database
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            // Save the new user to the database
            const result = await user.save();

            // Render login page after successful sign-up
            if (result) {
                res.render('login',{keyword:false});
            } else {
                console.log("hellooo", user);
            }
        } else {
            // If email already exists, render sign-up page with error message
            res.render('signup', { userrr: true });
        }
    } catch (ex) {
        // Handle exceptions
        console.log(ex.message);
    }
});
routes.get('/forgotpassword',async (req,res)=>{
    res.render('forgotpassword',{pass:false});
})
routes.post('/forgotpassword',async (req,res)=>{
    const email=req.body.email;
   let mailTransporter =
   await nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: '210701154@rajalakshmi.edu.in',
                pass: 'ginf mzis fqqt qkwr'
            }
        }
    );
 
let mailDetails = {
    from: '210701154@rajalakshmi.edu.in',
    to: email,
    subject: 'Change password',
    text: 'http://localhost:5000/changepassword'
}
 
const res1=await mailTransporter.sendMail(mailDetails);
if(res1!=undefined){
res.render('forgotpassword',{pass:true});
}
//console.log(res1);

});
routes.get('/changepassword',async (req,res)=>{
    res.render('changepassword');
});
routes.post('/changepassword',async (req,res)=>{
    const user=await Users.updateOne({email:req.body.email},{
        $set:{
         password:req.body.newPassword
        }
    });
if(user!=undefined){
    res.render('login');
}
})
// Export routes
module.exports = routes;