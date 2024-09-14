const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authMiddleware');
const db = require("../models/index");
const {  where, Op, Sequelize } = require('sequelize');
const Joi = require("joi");
const path = require('path');
const sharp = require('sharp');
const exp = require('constants');


exports.createBlog=async (req, res) => {
    const { title, content } = req.body;
    console.log(req.user);
    try {
        const blog = await db.Blogs.create({ title, content, authorId: req.user.userId });
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogs=async(req, res)=>{
    const {limit, start, orderby, orderdir } = req.query;
    const limitClause = limit ? parseInt(limit, 10) : undefined;
    const offsetClause = start ? parseInt(start, 10) : undefined;

    // Default to ordering by 'id' if no column is specified 
    const orderColumn = orderby || 'id'; 
    // Default to 'ASC' if no direction is specified
    const orderDirection = orderdir === 'DESC' ? 'DESC' : 'ASC'; 

    const schema = Joi.object({
        limit: Joi.number().integer(),
        start:Joi.number().integer(),
        orderBy: Joi.string().valid('title', 'createdAt', 'updatedAt','content','id','likeNum',"userId").default('id'),
        orderDirection: Joi.string().valid('ASC', 'DESC').default('ASC'),
    });
    
    const { error, value } = schema.validate({
        limit: limitClause,
        start: offsetClause,
        orderBy: orderColumn,
        orderDirection: orderDirection,
    });
    if(error){
        return res.status(400).json({message:"Invalid format for parameters!"});
    }

    try{
    const blogs = await db.Blogs.findAll({
        offset:offsetClause,
        limit:limitClause,
        order: [[orderColumn, orderDirection]],
        // include: [{ model: db.Users , as: 'authorId', attributes: ['username'] }]
    });
    res.json(blogs);
    }catch(err){
        res.status(500).json({error:err.message});
}};

exports.getSingleBlog=async(req, res)=>{

    const {id}= req.query;
    const schema = Joi.object({
        id: Joi.string().pattern(/^\d+$/).required(), // only integer
    });
    const {error} = schema.validate({ id: id });
    if(error){
        return res.status(400).json({message:"Invalid format, id must be an integer!"});
    }

    try{
        const blogs = await db.Blogs.findAll({
            where: {id: parseInt(id, 10)},
            include: [{ model: db.Users, attributes: ['username'] }]
        });
        res.status(200).json(blogs);
        }catch(err){
            res.status(500).json({error:err.message});
        }
};

exports.likeBlog=async(req, res)=>{
    const { blogId } = req.params;
    const userId = req.user.userId;
    
    const schema = Joi.object({
        id: Joi.string().pattern(/^\d+$/).required(), // only integer
    });
    const {error} = schema.validate({ id: blogId });
    if(error){
        return res.status(400).json({message:"Invalid format, id must be an integer!"});
    }

    try {
        // const [like, created] = await Like.findOrCreate({ where: { blogId, userId } });
        const like = await db.Likes.findOne({
            where:{
                blogId : blogId
            }
        });
        const thisblog = await db.Blogs.findByPk(blogId);
        if(!thisblog){
            res.json({message:"no blog was found for this ID"});
        }
        if(like){
            await like.destroy(); 
            const decrementResult = await thisblog.decrement('likeNum',{by:1});
            res.status(202).json({message:"unliked successfully!", decrementResult:decrementResult});
        }else{
            const newlike = await db.Likes.create({
                userId:userId,
                blogId:blogId
            });
            const incrementResult = await thisblog.increment('likeNum', { by:1 });
            res.status(201).json({like:newlike, incrementResult:incrementResult});
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
