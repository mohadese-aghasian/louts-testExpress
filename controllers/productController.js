const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authMiddleware');
const db = require("../models/index");
const {  where, Op, Sequelize } = require('sequelize');
const Joi = require("joi");
const path = require('path');
const sharp = require('sharp');
const exp = require('constants');
const { RelationshipType } = require('sequelize/lib/errors/database/foreign-key-constraint-error');
// const Sequelize=require(Sequelize);

exports.menu=async(req, res)=>{
    try{
        const categories = await db.CategoryPaths.findAll();
  
        const categoryMap = {};
        const rootCategories = {};
      
        // Create a map of path to category nodes
        categories.forEach(category => {
            const pathParts = category.path.split('/').filter(Boolean); // Split path into parts and filter out empty strings
            const categoryNode = { name: category.name, children: [] };
            categoryMap[category.path] = categoryNode;
        
            // If it's a root category, add to rootCategories
            if (pathParts.length === 1) {
              rootCategories[category.path] = categoryNode;
            }
          });
      
        // Build the tree by adding children to their parents
        Object.keys(categoryMap).forEach(path => {
            const pathParts = path.split('/').filter(Boolean); // Split path into parts
            if (pathParts.length > 1) {
              // Construct parent path by removing the last part
              const parentPath = pathParts.slice(0, -1).join('/');
              if (categoryMap[parentPath + '/']) {
                categoryMap[parentPath + '/'].children.push(categoryMap[path]);
              }
            }
          });

  return res.json(rootCategories);
  
    }catch(err){
        return res.json({message:err.message});
    }
}

exports.products=async(req, res)=>{
    const {limit, start, orderby, orderdir ,searchtext} = req.query;
    const limitClause = limit ? parseInt(limit, 10) : undefined;
    const offsetClause = start ? parseInt(start, 10) : undefined;

    // Default to ordering by 'id' if no column is specified 
    const orderColumn = orderby || 'id'; 
    // Default to 'ASC' if no direction is specified
    const orderDirection = orderdir === 'DESC' ? 'DESC' : 'ASC'; 

    const schema = Joi.object({
        searchtext: Joi.string().max(100).default(" ").messages({
            'string.max': 'Search text must be 100 characters or fewer.'
        }),
        limit: Joi.number().integer().messages({
        'number.base': 'Limit must be a number.',
        'number.integer': 'Limit must be an integer.',}),
        start:Joi.number().integer().messages({
            'number.base': 'Start must be a number.',
            'number.integer': 'Start must be an integer.',
        }),
        orderBy: Joi.string().valid('title', 'createdAt', 'updatedAt','description','price','id').default('id').messages({
            'string.base': 'OrderBy must be a string.',
            'any.only': 'OrderBy must be one of [title, createdAt, updatedAt, description, price, id].',
        }),
        orderDirection: Joi.string().valid('ASC', 'DESC').default('ASC').messages({
            'string.base': 'OrderDirection must be a string.',
            'any.only': 'OrderDirection must be either ASC or DESC.',
        }),
    });
    
    const { error, value } = schema.validate({
        searchtext:searchtext,
        limit: limitClause,
        start: offsetClause,
        orderBy: orderColumn,
        orderDirection: orderDirection,
    });
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    const searchquery=value.searchtext.split(' ').join("|");
    try{
        const products=await db.Products.findAll({
            limit:limitClause,
            offset:offsetClause,
            order: [[orderColumn, orderDirection]],
            where:{
                [Op.or]:[
                    {title:{
                        [Op.regexp] : searchquery,
                        
                    }},
                    {description:{
                        [Op.regexp]: searchquery
                    }}
                ]
            },
            include:[{
                model: db.Categories,
                required: false,
                as: 'categories',
                include: [
                    {
                      model: db.Categories,
                      as: 'parent',
                      include: [
                        {
                          model: db.Categories,
                          as: 'parent', 
                          required: false,
                        },
                      ],
                    }],
                }],
        });
        return res.json(products);
    }catch(err){
        return res.status(500).json({message:err});
    }
}
exports.products2=async(req, res)=>{
    const {limit, start, orderby, orderdir ,searchtext} = req.query;
    const limitClause = limit ? parseInt(limit, 10) : undefined;
    const offsetClause = start ? parseInt(start, 10) : undefined;

    // Default to ordering by 'id' if no column is specified 
    const orderColumn = orderby || 'id'; 
    // Default to 'ASC' if no direction is specified
    const orderDirection = orderdir === 'DESC' ? 'DESC' : 'ASC'; 

    const schema = Joi.object({
        searchtext: Joi.string().max(100).default(" ").messages({
            'string.max': 'Search text must be 100 characters or fewer.'
        }),
        limit: Joi.number().integer().messages({
        'number.base': 'Limit must be a number.',
        'number.integer': 'Limit must be an integer.',}),
        start:Joi.number().integer().messages({
            'number.base': 'Start must be a number.',
            'number.integer': 'Start must be an integer.',
        }),
        orderBy: Joi.string().valid('title', 'createdAt', 'updatedAt','description','price','id').default('id').messages({
            'string.base': 'OrderBy must be a string.',
            'any.only': 'OrderBy must be one of [title, createdAt, updatedAt, description, price, id].',
        }),
        orderDirection: Joi.string().valid('ASC', 'DESC').default('ASC').messages({
            'string.base': 'OrderDirection must be a string.',
            'any.only': 'OrderDirection must be either ASC or DESC.',
        }),
        category: Joi.string().default('/').messages({
            'string.empty': 'Category is required',
            'any.required': 'Category is required'
        }),
        exclusive: Joi.string().valid('1', '').allow(null).optional().messages({
        'any.only': 'Exclusive must be 1 or an empty string',
        }),
    });
    
    const { error, value } = schema.validate({
        searchtext:searchtext,
        limit: limitClause,
        start: offsetClause,
        orderBy: orderColumn,
        orderDirection: orderDirection,
        category:req.query.category,
        exclusive:req.query.exclusive,
    });
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    const { category, exclusive } = value;
        
    let endcategory = '';
    if (exclusive === '1') {
        endcategory = category + '/';
    }
    const searchquery=value.searchtext.split(' ').join("|");
    try{
        if(category!='/'){
            const categoryExists = await db.CategoryPaths.findOne({
                where: {
                name: category
                }
            });

            if(!categoryExists){
                return res.status(404).json({message:'category was not found'});
            }
        }
        const products=await db.Products.findAll({
            limit:limitClause,
            offset:offsetClause,
            order: [[orderColumn, orderDirection]],
            where:{
                [Op.or]:[
                    {title:{
                        [Op.regexp] : searchquery,
                        
                    }},
                    {description:{
                        [Op.regexp]: searchquery
                    }}
                ]
            },
            include:[{
                model: db.ProductCategoryPaths,
                required: true,
                include: [{
                    model: db.CategoryPaths,
                    attributes:['name','path'],
                    where:{
                        path:{
                            [Op.and]:
                            {
                                [Op.substring]:category,
                                [Op.endsWith]:endcategory,
                            }
                        }
                    }
                  }],
                }],
        });
        return res.json(products);
    }catch(err){
        return res.status(500).json({message:err});
    }
}
exports.filter=async(req, res)=>{

    const schema = Joi.object({
        category: Joi.string().required().messages({
          'string.empty': 'Category is required',
          'any.required': 'Category is required'
        }),
        exclusive: Joi.string().valid('1', '').allow(null).optional().messages({
          'any.only': 'Exclusive must be 1 or an empty string',
        })
      });

        const { error, value } = schema.validate(req.query);
        if(error){
            return res.json({message:error.message});
        }
        const { category, exclusive } = value;
        
        let endcategory = '';
        if (exclusive === '1') {
            endcategory = category + '/';
        }

    try{
        const categoryExists = await db.CategoryPaths.findOne({
            where: {
              name: category
            }
        });
        if(!categoryExists){
            return res.status(404).json({message:'category was not found'});
        }


        const products=await db.Products.findAll({
            include:[{
                model: db.ProductCategoryPaths,
                required: true,
                include: [{
                    model: db.CategoryPaths,
                    attributes:['name','path'],
                    where:{
                        path:{
                            [Op.and]:
                            {
                                [Op.substring]:category,
                                [Op.endsWith]:endcategory,
                            }
                        }
                    }
                  }],
                }],
        });
        return res.json(products);
    }catch(err){
        res.json({message:err.message});
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
            include:[{
                model: db.Categories,
                required: false,
                as: 'categories',
                include: [
                    {
                      model: db.Categories,
                      as: 'parent',
                    //   include: [
                    //     {
                    //       model: db.Categories,
                    //       as: 'parent', 
                    //       required: false,
                    //     },
                    //   ],
                    }],
                }],
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
            },
            include: [{
                model: db.Products,
                required: true
               }]
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