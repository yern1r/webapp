import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import multer from 'multer';


import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import {validationResult} from "express-validator";


import {handleValidationErrors , checkAuth} from "./utils/index.js";


import  {UserController , PostController } from "./controller/index.js";



mongoose.set('strictQuery', false);

//connect to mongo db , check connection ,
// if there is error catch and show
mongoose
    .connect('mongodb+srv://adminWeb:adminWeb@webapp.ee6lqeb.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

//storage for pictures
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb ( null, 'uploads');
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({ storage });

//to read json
app.use(express.json());

//direction to directory uploads, get request to get static file
app.use('/uploads' , express.static('uploads'));

//if there is get request , you will do function()
// which will return request and response
    /*app.get('/',(req, res)=>{
        res.send('Hello world!');
    });*/




//authentication
//if there is post request , return request and response
app.post('/auth/login', loginValidation , handleValidationErrors , UserController.login );

//if there is request for auth/register,
//we check in auth/register that we need, if we have what we need
//go to run (req, res) function
app.post('/auth/register', registerValidation , handleValidationErrors ,  UserController.register);

app.get('/auth/me',checkAuth,UserController.getMe);


app.post( '/uploads', checkAuth , upload.single('image'), (req , res) =>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


//routes
// get all articles
app.get('/posts', PostController.getAll);

//get article by id
app.get('/posts/:id', PostController.getOne);

//creating article
app.post('/posts', checkAuth ,postCreateValidation, handleValidationErrors , PostController.create);

//deleting article
app.delete('/posts/:id', checkAuth ,PostController.remove);

//updating article a
app.patch('/posts/:id', checkAuth , postCreateValidation , handleValidationErrors , PostController.update);

//run app, on localhost/4444
//error/success
app.listen(4444,(err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server OK')
});

