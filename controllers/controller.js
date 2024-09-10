const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authMiddleware');
const db = require("../models/index");
const {  where, Op, Sequelize } = require('sequelize');
const Joi = require("joi");
const path = require('path');
const sharp = require('sharp');
const exp = require('constants');
// const Sequelize=require(Sequelize);



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

//////////////////////////////// COMMERCE /////////////////////////////////
exports.products=async(req, res)=>{
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
        orderBy: Joi.string().valid('title', 'createdAt', 'updatedAt','description','price','id').default('id'),
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
        const products=await db.Products.findAll({
            limit:limitClause,
            offset:offsetClause,
            // orderBy:orderColumn,
            // orderDirection:orderDirection
            order: [[orderColumn, orderDirection]],
        });
        return res.json(products);
    }catch(err){
        return res.status(500).json({message:err});
    }
}

async function ProcessImage(req, imageName){
    const coverPath = path.join(__dirname, '../images/covers', 'cover-'+imageName);
    const previewPath = path.join(__dirname, '../images/preview', imageName);

    // Cover
    await sharp(req.file.buffer)
        .resize({height:200})  //only one width oe height to keep aspect ratio
        .jpeg({ quality: 75 }) // Set JPEG quality to 80
        .toFile(coverPath); // Save the processed image

    // Preview
    await sharp(req.file.buffer)
        .resize({height:800})  //only one width oe height to keep aspect ratio
        .jpeg({ quality: 95 }) // Set JPEG quality to 80
        .toFile(previewPath); // Save the processed image

}
exports.uploadCover=async(req, res)=>{
    try{
        const imageName=`productimage-${Date.now()}.webp`;

        await ProcessImage(req, imageName);

        const newcover= await db.ProductCovers.create({
            name:imageName,
        });

        console.log(newcover);
        res.status(201).json({coverId:newcover.id});

    }catch(err){

    }
}
exports.addProduct=async(req, res)=>{
    const {title, description, price, coverId}=req.body;
    console.log(req.body);
    if(!coverId){
        return res.json({message:"please upload image!"});
    }
    const schema = Joi.object({
        id: Joi.number().integer().required()
    });
    const {error} = schema.validate({ id: coverId });
    if(error){
        return res.status(400).json({message:"Invalid format, id must be an integer!"});
    }

    try {
    
        const newproduct = await db.Products.create({
            title: title,
            description: description, 
            price: price,
            coverId:coverId
        });
    

        res.status(201).json({ message: 'File uploaded and processed successfully', newproduct });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process the image.', error: error.message });
    };
}

exports.addFavourite=async(req, res)=>{
    const {productId} = req.params;
    const userId = req.user.userId;
    if(!productId){
        return res.json({message:"product ID is required!"});
    }

    const schema = Joi.object({
        id: Joi.string().pattern(/^\d+$/).required(), // only integer
    });
    const {error} = schema.validate({ id: productId });
    if(error){
        return res.status(400).json({message:"Invalid format, id must be an integer!"});
    }
    
    try{

        const favourite = await db.FavouriteProducts.findOne({
            where:{
                productId:productId
            }
        });
        if(favourite){
            await favourite.destroy();
            return res.status(202).json({message:"removed from favourite."});
        }else{
            const product=await db.Products.findOne({where:{id:productId}});
            if(!product){
                return res.status(404).json({message:"no product was found for this ID"});
            }
            const addfavourite =await db.FavouriteProducts.create({
                productId:productId,
                userId:userId
            });
            res.status(201).json({message:"added to favourite!",result:addfavourite});
        }
    }catch(err){
        console.log(err.message);
        res.status(500).json({message:err.message});
    }
}

exports.oneProduct=async(req, res)=>{
    const {productId}=req.params;
    const schema = Joi.object({
        id: Joi.string().pattern(/^\d+$/).required(), // only integer
    });
    const {error} = schema.validate({ id: productId });
    if(error){
        return res.status(400).json({message:"Invalid format, id must be an integer!"});
    }

    try{
        const product= await db.Products.findOne({
            where:{id: parseInt(productId, 10)},
        });
        if(!product){
            return res.json({message:"no product was found for this ID"})
        }
        res.json(product);
        
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.getFavourites=async(req, res)=>{
    
    try{
        const favourites =await db.FavouriteProducts.findAll({
            where:{
                userId: req.user.userId,
            }
        });

        res.status(200).json(favourites);
    }catch(err){

    }
}

exports.searchProducts=async(req, res)=>{
    const {title, description} =req.query;

    const schema = Joi.object({
        title: Joi.string().default(" "),
        description:Joi.string().default(" "),
    });
    const {error, value} = schema.validate({ 
        title: title,
        description:description,
     });
    if(error){
        return res.status(400).json({message:"Invalid format!"});
    }

    const titlequeries=value.title.split(' ').join("|");
    const descqueries=value.description.split(' ').join("|");

    console.log(titlequeries, descqueries);

    try{
     const products= await db.Products.findAll({
        where:{
            [Op.or]:[
                {title:{
                    // [Op.match]: Sequelize.fn('to_tsquery', titlequeries)
                    [Op.regexp] : titlequeries
                }},
                {description:{
                    // [Op.match]: Sequelize.fn('to_tsquery', descqueries)
                    [Op.regexp]: descqueries
                }}
            ]
        }
     });
    return res.status(200).json(products);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}