const express= require('express');
const sequelize = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authMiddleware');
const { Pool } = require('pg');
const {userModel, blogModel, likeModel} = require('../models/allmodels');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'userblogdb',
    password: 'postgres76555432',
    port: 5432,
});


exports.login=async(req, res)=>{

    const user = await userModel.findOne({ where: { username:req.body.username } });

    if (!user) {
        return res.status(401).json({ message: 'Invalid username' });
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user.id }, 'lotus_secret', { expiresIn: '1h' });
    // Store token in the database
    await pool.query('INSERT INTO user_tokens (user_id, token) VALUES ($1, $2)', [user.id, token]);
    res.json({ token });
};

exports.logout= async(req, res)=>{
    const token = req.headers.authorization.split(' ')[1];
    await pool.query('DELETE FROM user_tokens WHERE token = $1', [token]);
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.register=async(req, res)=>{
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await userModel.create({ username, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
}

exports.createBlog=async (req, res) => {
    const { title, content } = req.body;

    try {

        const blog = await blogModel.create({ title, content, userId: req.user.userId });
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllBlogs=async(req, res)=>{

    try{
    const blogs = await blogModel.findAll({
        include: [{ model: userModel, as: 'author', attributes: ['username'] }]
    });
    res.json(blogs);
    }catch(err){
        console.log(err);
        res.status(500).json({error:err.message});
}};

exports.likeBlog=async(req, res)=>{
    const { blogId } = req.params;
    const userId = req.user.userId;

    try {
        // const [like, created] = await Like.findOrCreate({ where: { blogId, userId } });
        const like = await likeModel.findOne({
            where:{
                blogId : blogId
            }
        });
        const thisblog = await blogModel.findByPk(blogId);
        if(like){
            await like.destroy(); 
            const decrementResult = await thisblog.decrement('likeNum',{by:1});
            res.status(202).json({message:"unliked successfully!", decrementResult:decrementResult});
        }else{
            const newlike = await likeModel.create({
                userId:req.user.userId,
                blogId:blogId
            });
            const incrementResult = await thisblog.increment('likeNum', { by:1 });
            res.status(201).json({like:newlike, incrementResult:incrementResult});
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};