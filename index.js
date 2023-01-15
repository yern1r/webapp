import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {registerValidation} from './validations/auth.js';
import {validationResult} from "express-validator";

import UserModel from "./models/User.js";

mongoose.set('strictQuery', false);

//connect to mongo db , check connection ,
// if there is error catch and show
mongoose
    .connect('mongodb+srv://adminWeb:adminWeb@webapp.ee6lqeb.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express();

//to read json
app.use(express.json());

//if there is get request , you will do function()
// which will return request and response
    /*app.get('/',(req, res)=>{
        res.send('Hello world!');
    });*/

//run app, on localhost/4444
//error/success
app.listen(4444,(err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server OK')
});

//authentication
//if there is post request , return request and response
app.post('/auth/login',(req,res) =>
{
    console.log(req.body);

    //after request, we should generate token
    // and give data into token
    const token = jwt.sign(
        {
                    email: req.body.email,
                    fullName: 'Alex Max',
                },
        'secret123',
        );

    res.json({
            success: true,
            token,
    });
});

//if there is request for auth/register,
//we check in auth/register that we need, if we have what we need
//go to run (req, res) function
app.post('/auth/register',registerValidation,async (req, res)=>
{
    //after getting request, we will check it by parsing it

    //by validationResult we are checking for errors(empty/not empty)
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    //to get password from request into variable password
    const password = req.body.password;
    //algorithm of hashing
    const salt = await bcrypt.genSalt(10);
    //hashing
    const passwordHash = await bcrypt.hash(password, salt);

    //going to prepare document for creating user with mongodb
    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash,
    });

    //creating user in mongodb, saving doc which prepared
    const user = await doc.save();

    
    res.json(user);
});