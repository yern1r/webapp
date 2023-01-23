import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {registerValidation} from './validations/auth.js';
import {validationResult} from "express-validator";

import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controller/UserController.js";

mongoose.set('strictQuery', false);

//connect to mongo db , check connection ,
// if there is error catch and show
mongoose
    .connect('mongodb+srv://adminWeb:adminWeb@webapp.ee6lqeb.mongodb.net/blog?retryWrites=true&w=majority')
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


app.get('/auth/me',checkAuth, UserController.getMe, async (req,res) => {
    try{
        const user = await UserModel.findById(req.userId);

        if (!user){
            return res.status(404).json({
                message: 'User is not founded'
            });
        }

        //in order to avoid getting data about password
        const {passwordHash, ...userData} = user._doc;


        res.json(userData);
    }catch (err){
        console.log(err);

        //message error
        res.status(500).json({
            message: 'No access',
        });
    }
});


//authentication
//if there is post request , return request and response
app.post('/auth/login', UserController.login , async (req,res) =>
{
    try{
        //in order to find user in database
        const user = await UserModel.findOne({
            //find by email
            email: req.body.email});

        //if we did not find user/login
        if(!user) {
            return res.status(404).json({
                message: 'Wrong Email/password',
            });
        }

        //if password does not match
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass){
            return res.status(400).json({
                message: 'Wrong email/Password',
            });
        }


        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );
        //in order not to return hash password
        const {passwordHash, ...userData} = user._doc;

        //return only 1 thing!!!
        res.json({
            ...userData,
            token,
        });

    }catch (err){

        console.log(err);

        //message error
        res.status(500).json({
            message: 'Failed to authorize',
        });
    }
});

//if there is request for auth/register,
//we check in auth/register that we need, if we have what we need
//go to run (req, res) function
app.post('/auth/register', registerValidation,UserController.register ,async (req, res)=>
{
    //after getting request, we will check it by parsing it

   try {
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
       const hash = await bcrypt.hash(password, salt);

       //going to prepare document for creating user with mongodb
       const doc = new UserModel({
           email: req.body.email,
           fullName: req.body.fullName,
           avatarUrl: req.body.avatarUrl,
           passwordHash: hash,
       });

       //creating user in mongodb, saving doc which prepared
       const user = await doc.save();

       //after request, we should generate token
       // and give data into token
       const token = jwt.sign({
           _id: user._id,
       },
           'secret123',
           {
               expiresIn: '30d',
                },
           );

       //in order to avoid getting data about password
       const {passwordHash, ...userData} = user._doc;

        //return only 1 thing!!!
       res.json({
           ...userData,
            token,
       });

       //


   } catch (err) {
       //information for us
       console.log(err);

       //message error
       res.status(500).json({
           message: 'Failed to register',
       });
   }
});

//run app, on localhost/4444
//error/success
app.listen(4444,(err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server OK')
});

