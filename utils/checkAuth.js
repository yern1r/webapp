import jwt from 'jsonwebtoken';
import {json} from "express";

//middleware -function bridge
// between an operating system or database and applications

export default (req, res, next) =>{
    //parsing token

    //if there is no token = undefined, but give string and delete Bearer and replace it by empty string
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token){
    try{
        const decoded = jwt.verify(token, 'secret123');

        req.userId = decoded._id;

        next();

        }catch (e){
            return res.status(403).json({
                message : 'No access',
            });
        }
        
    }else{
        return res.status(403).json({
            message : 'No access',
        });
    }

    //to run next function/action
    //next();
}