import {validationResult} from "express-validator";

export default (req, res , next) => {

    //by validationResult we are checking for errors(empty/not empty)
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    next();
};