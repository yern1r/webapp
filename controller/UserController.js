import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res)=>
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
}

export const login = async (req,res) =>
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
}

export const getMe = async (req,res) => {
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
}