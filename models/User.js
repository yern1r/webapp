import mongoose from "mongoose";
//model of user
//schema of tables
//-mongoose, create schema of user
const UserSchema = new mongoose.Schema({
    //properties
    fullName: { //settings/rule for full name
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    //if with {} - required , without {} - not required
    avatarUrl: String,
},
    //also when creating user
    // there should be a time of creature/updates
    {
        timestamps: true,

    });
//export the scheme to mongoose
export default mongoose.model('User', UserSchema)