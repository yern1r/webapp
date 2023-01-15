import {body} from "express-validator";

//validation is for checking that user provides accurate data
export const registerValidation = [
    body('email', 'Not correct form of email').isEmail(),
    body('password', 'Not correct password').isLength({min: 5}),
    body('fullName', 'Provide full name').isLength({min: 3}),
    body('avatarUrl', 'Not correct URL').optional().isURL(),
];