const express= require('express');
const mongoose=require("mongoose");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const Like= require("../models/likeModel");
const md5 = require("md5");
const passportLocalMongoose=require("passport-local-mongoose");
const passport = require('passport');


var userInfo={};

// export.name --> creating my own module
exports.viewLogin= (req, res)=>{
    if(req.isAuthenticated()){
        res.render("blogs/login");
    }else{
        res.render("blogs/login");
    }
};
exports.logout= (req, res)=>{
    if(req.isAuthenticated()){
        req.logout(function(err){
            if(err){
                res.status(500).send(err); 
            }else{
                res.render("/login");
            }
        });
    }else{
        res.send("you need to login first.");
    }
};

exports.loginUser = async(req ,res)=>{

    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local");
            res.redirect("/blogs/allblogs");
        }
    });

};

exports.viewRegister= (req, res)=>{
    res.render("registerpage");
};

exports.registerUser= function(req, res){

    User.register({username:req.body.username}, req.body.password,function(err, user){

            if(err){
                console.log(err);
                res.redirect("/blogs/register");
            }else{
               passport.authenticate("local")(req, res, function(){
                res.redirect("/blogs/allblogs");
               }); 
            }
        });
};

exports.getAllBlogs = async(req, res)=>{
    if(req.isAuthenticated()){
    try{
        
        var allBlogs = await Blog.aggregate([
            {
                $lookup: {
                    from: 'likes', 
                    localField: '_id',
                    foreignField: 'blog',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likeCount: { $size: '$likes' }
                }
            },
            {
                $project: {
                    likes: 0 
                }
            }
        ]);

        res.render("blog", {allBlogs:JSON.stringify(allBlogs)});
        // console.log(allBlogs);
    }catch(err){
        res.status(500).send("someting went wrong! cant show blogs");
    }
}else{
    res.render("loginpage");
}
};

exports.createNewBlog = async(req, res)=>{
    console.log(userInfo);
    try{
        var author= await User.findOne({_id:req.user._id}).exec();
        await Blog.create({
            title:req.body.title,
            content:req.body.content,
            author:author,
        });
        res.status(201).send("successfully created.");
    }
    catch(err){
        res.status(500).send(err.message);
    }
};

exports.likeBlog= async(req, res)=>{
    var likeobj= await Like.findOne({
        blog:req.params.blogid,
        user:req.user
    },"_id").exec();

    if(likeobj){
        try{
        await Like.findByIdAndDelete(likeobj._id);
        res.send("unliked successfully!");
        }catch(err){
            res.status(500).send(err);
        }
    }else{
        var myblog=await Blog.findOne({_id:req.params.blogid}).exec();
        console.log(myblog);
        try{
            console.log(`*****user:${req.user}`);
            await Like.create({
                blog:myblog, 
                user:req.user
            });
            res.send("liked successfully!");

        }catch(err){
            res.status(500).send(err);
        }
    }
};


