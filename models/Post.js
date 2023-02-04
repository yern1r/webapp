import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
        //properties
        title: { //settings/rule for full name
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        //if with {} - required , without {} - not required
        imageUrl: String,
    },
    //also when creating user
    // there should be a time of creature/updates
    {
        timestamps: true,

    });
//export the scheme to mongoose
export default mongoose.model('Post', PostSchema)