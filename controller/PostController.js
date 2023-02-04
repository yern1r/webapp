import PostModel from '../models/Post.js';
import {json} from "express";


export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Failed to get all articles',
        });
    }
};

export const getOne = async (req, res) => {
    try{
        const postId = req.params.id;

        PostModel.findOneAndUpdate({
            _id: postId,
        },
            {
                $inc : {viewCount: 1},
        },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
             if(err){
                 console.log(err);
                 return res.status(500).json({
                     message: 'Failed to get article',
                 });
             }

             if (!doc){
                 return res.status(404).json({
                     message: 'Article is not found',
                 });
             }

             res.json(doc);
        } );

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Failed to get one articles',
        });
    }
};
export const remove = async (req, res) => {
    try{
        const postId = req.params.id;

        PostModel.findOneAndDelete({
           _id: postId,
        },
            (err, doc) => {
            if (err){
                console.log(err);
                return res.status(500).json({
                    message: 'Failed to delete article'
                });
            }

            if (!doc){
                console.log(err);
                return res.status(404).json({
                    message: 'Article is not found'
                });
            }

            res.json({
                message: 'successfully deleted'
            });

        });

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Failed to delete article',
        });
    }
};

export const create = async (req , res) => {
    try {
        const doc = new PostModel({
           title: req.body.title,
           text: req.body.title,
           imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        //after doc is ready we are creating it

        const post = await doc.save();

        res.json(post);

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Failed to create article',
        });
    }
};