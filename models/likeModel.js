const mongoose=require("mongoose");
const User=require("./userModel");
const Blog=require('./blogModel');

const likeSchema=mongoose.Schema({
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
});
const Like = mongoose.model("Like", likeSchema);
module.exports=Like;