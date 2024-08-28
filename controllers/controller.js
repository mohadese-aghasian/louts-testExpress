const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authMiddleware');
const db = require("../models/index");
const {  where } = require('sequelize');
const Joi = require("joi");


exports.login=async(req, res)=>{

    const user = await db.Users.findOne({ where: { username:req.body.username } });

    if (!user) {
        return res.status(401).json({ message: 'Invalid username' });
    }
    
    if(!(req.body.password===user.password)){
        return res.status(401).json({ message: 'Invalid password' });
    }
    // if(!(await bcrypt.compare(req.body.password, user.password))){
    //     return res.status(401).json({ message: 'Invalid password' });
    // }
    try{
    const token = jwt.sign({ userId: user.id }, 'lotus_secret', { expiresIn: '1h' });
    // Store token in the database
    await db.UserTokens.create({token:token, user_id:user.id});
    res.status(200).json({ token });
    }catch(err){
        res.status(500).json({message:err});
    }
};

exports.logout= async(req, res)=>{
    const token = req.headers.authorization.split(' ')[1];
    try{
    await userToken.destroy({where:{token:token}});
    res.status(200).json({ message: 'Logged out successfully' });
    }catch(err){
        res.status.json({message:err});
    }
};

exports.register=async(req, res)=>{
    const { username, password , email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await db.Users.create({ username, password: hashedPassword,email:email });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
}

exports.createBlog=async (req, res) => {
    const { title, content } = req.body;

    try {
        const blog = await db.Blogs.create({ title, content, userId: req.user.userId });
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
        include: [{ model: db.Users , as: 'author', attributes: ['username'] }]
    });
    res.json(blogs);
    }catch(err){
        res.status(500).json({error:err.message});
}};

exports.getSingleBlog=async(req, res)=>{

    const {id}= req.query;
    const schema = Joi.object({
        id: Joi.number().integer().required(),
    });

    try{
        
        const {error} = schema.validate({ id: id });
        if(error){
            return res.status(400).json({message:"Invalid format, id must be an integer!"});
        }

        const blogs = await db.Blogs.findAll({
            where: {id: parseInt(id, 10)},
            include: [{ model: db.Users, as: 'author', attributes: ['username'] }]
        });
        res.status(200).json(blogs);
        }catch(err){
            res.status(500).json({error:err.message});
        }
}

exports.likeBlog=async(req, res)=>{
    const { blogId } = req.params;
    const userId = req.user.userId;
    
    try {
        // const [like, created] = await Like.findOrCreate({ where: { blogId, userId } });
        const like = await db.Likes.findOne({
            where:{
                blogId : blogId
            }
        });
        const thisblog = await db.Blogs.findByPk(blogId);
        if(like){
            await like.destroy(); 
            const decrementResult = await thisblog.decrement('likeNum',{by:1});
            res.status(202).json({message:"unliked successfully!", decrementResult:decrementResult});
        }else{
            const newlike = await db.Likes.create({
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