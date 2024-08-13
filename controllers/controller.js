const express= require('express');
const mongoose=require("mongoose");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const Like= require("../models/likeModel");
const md5 = require("md5");

var userInfo={};

// export.name --> creating my own module
exports.viewLogin= (req, res)=>{
    if(Object.keys(userInfo).length === 0){
        res.render("loginpage");
    }else{
        res.render("blog");
    }
};
exports.logout= (req, res)=>{
    if(Object.keys(userInfo).length === 0){
        res.send("you need to login first.");
    }else{
        res.render("loginpage");
    }
};

exports.loginUser = async(req ,res)=>{
    var myusername=req.body.username;
    var mypassword=md5(req.body.password);
    try{
        var isuser= await User.findOne({username:myusername}).exec();
        if(isuser){
            console.log(isuser);
            if(isuser.password==mypassword){
                userInfo=isuser;
                console.log(isuser);
                res.render("blog");
            }else{
                res.send("the password is not matching!");
            }
        }else{
            res.send("the user has not been found!");
        }

    }catch(err){
        res.status(500).send(err);
    }
};

exports.viewRegister= (req, res)=>{
    res.render("registerpage");
};

exports.registerUser= async(req, res)=>{
    var username=req.body.username;
    var password=md5(req.body.password); 

    try{
        userInfo={
            username:username,
            password:password
        };
        await User.create(userInfo);
        res.render("loginpage");
    } catch(err){
        res.status(500).send(`erro:${err}`);
    }
};

exports.getAllBlogs = async(req, res)=>{
    if(Object.keys(userInfo).length !== 0){
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
    res.send("you need to login first");
}
};

exports.createNewBlog = async(req, res)=>{
    console.log(userInfo);
    try{
        var author= await User.findOne({_id:userInfo}).exec();
        await Blog.create({
            title:req.body.title,
            content:req.body.content,
            author:author,
        });
        console.log(userInfo);
        res.status(201).send("successfully created.");
    }
    catch(err){
        res.status(500).send(err.message);
    }
};

exports.likeBlog= async(req, res)=>{
    var likeobj= await Like.findOne({
        blog:req.params.blogid,
        user:userInfo
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
            await Like.create({
                blog:myblog, 
                user:userInfo
            });
            res.send("liked successfully!");

        }catch(err){
            res.status(500).send(err);
        }
    }
};


