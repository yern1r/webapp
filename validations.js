import {body} from "express-validator";


//validation is for checking that user provides accurate data

export const loginValidation = [
    body('email', 'Not correct form of email').isEmail(),
    body('password', 'Not correct password').isLength({min: 5}),
];
export const registerValidation = [
    body('email', 'Not correct form of email').isEmail(),
    body('password', 'Not correct password').isLength({min: 5}),
    body('fullName', 'Provide full name').isLength({min: 3}),
    body('avatarUrl', 'Not correct URL').optional().isURL(),
];


export const postCreateValidation = [
    body('title', 'Title for article').isLength({min: 3}).isString(),
    body('text', 'Text of article').isLength({min: 3}).isString(),
    body('tags', 'No correct form of tag').optional().isString(),
    body('imageUrl', 'Not correct URL').optional().isString(),
];
