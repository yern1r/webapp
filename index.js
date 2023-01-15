import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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
app.get('/',(req, res)=>{
    res.send('Hello world!');
});

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