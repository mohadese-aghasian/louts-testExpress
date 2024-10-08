const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authMiddleware');
const db = require("../models/index");
const {  where, Op, Sequelize } = require('sequelize');
const Joi = require("joi");
const path = require('path');
const sharp = require('sharp');
const { Interface } = require('readline');
const { measureMemory } = require('vm');
const { name } = require('ejs');
const NodeCache = require("node-cache");
const { el } = require('@faker-js/faker');
const { Json } = require('sequelize/lib/utils');
const { stringify } = require('querystring');
const Redis = require('ioredis');

//////////////// CACHE //////
// const myCache = new NodeCache();
const redis = new Redis(); // Default: localhost:6379
/////////////////////////////

exports.menuByPass=async(req, res)=>{
    try{
        const categories = await db.CategoryPaths.findAll();
  
        const categoryMap = {};
        const rootCategories = {};
      
        // Create a map of path to category nodes
        categories.forEach(category => {
            const pathParts = category.path.split('/').filter(Boolean); // Split path into parts and filter out empty strings
            const categoryNode = { id:category.id, name: category.name, children: [] };
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
exports.menu=async(req, res)=>{
    try{
        // cache key = categories
        const cachedCategories=await redis.get('categories');
        let categories;
        
        //check for cache
        if(cachedCategories){
            categories=JSON.parse(cachedCategories);
        }else{
            categories = await db.Categories.findAll({
                include: [{
                model: db.Categories,
                as: 'children',
                }]
            });
        }
          const categoryMap = {};
          const rootCategories = {};
        
          // Create a map of category id to category node
          categories.forEach(category => {
            const categoryNode = {
              id: category.id,
              name: category.name,
              children: [],
            };
            categoryMap[category.id] = categoryNode;
        
            // If it has no parent, add to rootCategories
            if (!category.parentId) {
              rootCategories[category.id] = categoryNode;
            }
          });
        
          // Build the tree by adding children to their parents
          categories.forEach(category => {
            if (category.parentId) {
              const parent = categoryMap[category.parentId];
              if (parent) {
                parent.children.push(categoryMap[category.id]);
              }
            }
          });
        

  return res.json(rootCategories);
  
    }catch(err){
        return res.json({message:err.message});
    }
}

exports.products=async(req, res)=>{
    
    const {limit, start, orderby, orderdir ,searchtext, categoryId, arrayvalues, attributeId,  minPrice, maxPrice} = req.query;
    console.log("Received input:");
    console.log("searchtext:", searchtext);
    console.log("categoryId:", categoryId);
    console.log("attributeId:", attributeId);
    console.log("arrayvalues:", arrayvalues);
    console.log(attributeId,arrayvalues);

    let attributeIds, valuesArray;
    if(attributeId){
        attributeIds = Array.isArray(attributeId)&&attributeId ? attributeId : [attributeId];
    }
    if(arrayvalues){
        valuesArray = Array.isArray(arrayvalues)&&arrayvalues ? arrayvalues : [arrayvalues];
    }
    const limitClause = limit ? parseInt(limit, 10) : undefined;
    const offsetClause = start ? parseInt(start, 10) : undefined;
    // const valuesArray = Array.isArray(arrayvalues)&&arrayvalues ? arrayvalues : [arrayvalues];
    const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];
    // const attributeIds = Array.isArray(attributeId)&&attributeId ? attributeId : [attributeId];
    
    
    
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
        orderDirection:Joi.string().valid('ASC', 'DESC').default('ASC').messages({
            'string.base': 'OrderDirection must be a string.',
            'any.only': 'OrderDirection must be either ASC or DESC.',
        }),
        // category: Joi.string().default(null).messages({
        //     'string.empty': 'Category is required',
        // }),
        minPrice: Joi.number().precision(2).positive().optional(), 
        maxPrice: Joi.number().precision(2).positive().optional(),
        categoryId: Joi.array()
        .items(Joi.number().integer())
        .required() // Optional: Add this if you want to require the array
        .messages({
            'array.base': 'attributeId must be an array.',
            'array.includes': 'attributeId must contain only integers.',
            'array.required': 'attributeId is required.',
        }),
        attributeId: Joi.array().default(null)
        .items(Joi.number().integer())
        .messages({
            'array.base': 'categoryId must be an array.',
            'array.includes': 'categoryId must contain only integers.',
        }),
        arrayvalues:Joi.array().default(null)
        .items(Joi.string())
        .messages({
            'array.base': 'arrayvalues must be an array.',
            'array.includes': 'arrayvalues must contain only strings.',
        }),
    });
    
    const { error, value } = schema.validate({
        searchtext:searchtext,
        limit: limitClause,
        start: offsetClause,
        orderBy: orderColumn,
        orderDirection: orderDirection,
        categoryId:categoryIds,
        minPrice:minPrice, 
        maxPrice:maxPrice,
        arrayvalues:valuesArray,
        attributeId:attributeIds,
    });
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    
    let priceWhereClause;
    if (minPrice !== undefined && maxPrice !== undefined) {
        // if we have both
        priceWhereClause = {
            [Op.and]: [
                { price:{ [Op.gte]: parseFloat(minPrice)} },
                { price: {[Op.lte]: parseFloat(maxPrice)} }
            ]
        };
    }else if(minPrice || maxPrice){
        // if only one of them
       priceWhereClause = {
        ...(minPrice !== undefined && { price: { [Op.gte]: parseFloat(minPrice) } }), 
        ...(maxPrice !== undefined && { price: { [Op.lte]: parseFloat(maxPrice) } }),
        };
    }else{
        priceWhereClause={};
    }
    
    const searchquery=value.searchtext.split(' ').join("|");
    // attributeIds=value.attributeId;
    // valuesArray=value.arrayvalues;
    let attributeValuesWhereClause={};
    console.log("before try",attributeIds,valuesArray);

    try{
        
        console.log(attributeIds, valuesArray);
        if(attributeIds && valuesArray)
        {
            const attributevalues= await db.CategoryAttributeValues.findAll({
                where:{
                    [Op.and]:[
                        {categoryId:{[Op.in]:categoryIds}},
                        {attributeId:{[Op.in]:attributeIds}},
                        {value:{[Op.in]:valuesArray}}
                    ]
                }
            });

            console.log(JSON.stringify(attributevalues));
            let attributevalueIds=[];
            attributevalues.forEach(attrvalue=>{
                attributevalueIds.push(attrvalue.id);
            });
            
            attributeValuesWhereClause={
                attributeValueId:{
                    [Op.in]:attributevalueIds
                }
            }
        }
        console.log(JSON.stringify(attributeValuesWhereClause));
        const categoryExists = await db.Categories.findAll({
            where: {
                id:categoryIds,
            }
        });
        if(!categoryExists){
            return res.status(404).json({message:'category was not found'});
        }

        var products=await db.Products.findAll({
            limit:limitClause,
            offset:offsetClause,
            order: [[orderColumn, orderDirection]],
            attributes: { exclude: ['createdAt','updatedAt'] },
            where:{
                [Op.and]:[
                    {
                        [Op.or]:[
                            {title:{
                                [Op.substring] : value.searchtext,
                                
                            }},
                            {description:{
                                [Op.substring] : value.searchtext,
                            }}
                        ],
                    },
                    priceWhereClause,
                ]
            },
            include:[
                {
                    model:db.ProductCovers,
                    as: 'cover',
                    attributes:['name'],
                },
                {
                    model: db.Categories,
                    required: true,
                    as: 'categories',
                    attributes: { exclude: ['createdAt','updatedAt'] },
                    where: {
                        id:{[Op.in]:categoryIds}
                    },
                    include: [
                        {
                            model: db.Categories,
                            as: 'parent',
                            attributes: { exclude: ['createdAt','updatedAt','id',] },
                        }],
                },
                {
                    model: db.ProductAttributes,
                    as: 'attributeValues',
                    attributes: { exclude: ['createdAt','updatedAt'] },
                    where:attributeValuesWhereClause,
                    // where:{},
                    include: [
                        {
                        model: db.CategoryAttributeValues,
                        //   as: 'attribute', 
                        attributes: { exclude: ['createdAt','updatedAt'] },
                        
                        },
                    ],
                },
                
            ],
        
        });
        
        if(products.length === 0){
            products = await db.Products.findAll({
                
                limit:limitClause,
                offset:offsetClause,
                order: [[orderColumn, orderDirection]],
                where:{
                    [Op.and]:[
                        {
                            [Op.or]:[
                                {title:{
                                    [Op.regexp] : searchquery,
                                    
                                }},
                                {description:{
                                    [Op.regexp]: searchquery
                                }}
                            ]
                        },
                        priceWhereClause
                ]
                },
                include:[
                    {
                        model:db.ProductCovers,
                        as: 'cover',
                        attributes:['name'],
                    },
                    {
                        model: db.Categories,
                        required: true,
                        as: 'categories',
                        attributes: { exclude: ['createdAt','updatedAt'] },
                        where: {[Op.in]:categoryIds},
                        include: [
                            {
                                model: db.Categories,
                                as: 'parent',
                                attributes: { exclude: ['createdAt','updatedAt','id',] },
                            }],
                    },
                    {
                        model: db.ProductAttributes,
                        as: 'attributeValues',
                        attributes: { exclude: ['createdAt','updatedAt'] },
                        where:attributeValuesWhereClause,
                        include: [
                            {
                            model: db.CategoryAttributeValues,
                            //   as: 'attribute', 
                            attributes: { exclude: ['createdAt','updatedAt'] },
                            
                            },
                        ],
                    },
                    
                    ],
            }); 
        }
        return res.json(products);
    }catch(err){
        return res.status(500).json({message:err.message});
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
        
        var products=await db.Products.findAll({
            limit:limitClause,
            offset:offsetClause,
            order: [[orderColumn, orderDirection]],
            where:{
                [Op.or]:[
                    {title:{
                        [Op.substring] : value.searchtext,
                        
                    }},
                    {description:{
                        [Op.substring] : value.searchtext,
                    }}
                ]
            },
            include:[{
                model: db.ProductCategoryPaths,
                required: false,
                as:'category',
                attributes: { exclude: ['createdAt','updatedAt'] },
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
            include: [
                {
                    model: db.ProductAttributeValues,
                    as: 'attributeValues',
                    attributes: { exclude: ['createdAt','updatedAt'] },
                    
                    include: [
                    {
                        model: db.Attributes,
                        as: 'attribute', 
                        attributes: { exclude: ['createdAt','updatedAt','id'] },
                        
                    },
                    ],
                },
                ],
        });

        if(products.length === 0 ){
            products = await db.Products.findAll({
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
                    attributes: { exclude: ['createdAt','updatedAt','id'] },
                    include: [{
                        model: db.CategoryPaths,
                        attributes:['name','path'],
                        attributes: { exclude: ['createdAt','updatedAt'] },
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
                include: [
                    {
                        model: db.ProductAttributeValues,
                        as: 'attributeValues',
                        attributes: { exclude: ['createdAt','updatedAt'] },
                    //   where: ,
                        include: [
                        {
                            model: db.Attributes,
                            as: 'attribute', 
                            attributes: { exclude: ['createdAt','updatedAt','id'] },
                            
                        },
                        ],
                    },
                    ],
            });
        }
        return res.json(products);
    }catch(err){
        return res.status(500).json({message:err.message});
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

        res.status(201).json({coverId:newcover.id});

    }catch(err){

    }
}
exports.addProduct=async(req, res)=>{

    const {title, description, price, coverId, categoryId}=req.body;

    if(!coverId || !categoryId){
        return res.json({message:"please upload image or provide category!"});
    }

    const schema = Joi.object({
        coverid: Joi.number().integer().required(),
        price: Joi.number().required(),
        categoryId : Joi.number().integer().required(),
    });
    
    const {error} = schema.validate({ 
        coverid: coverId ,
        price:price,
        categoryId:categoryId
    });
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    try {
        // cache key = category:[categoryId]
        const cachedCategories=await redis.get(`category:${categoryId}`);
        let isCategoryExist;

        if(cachedCategories){
            console.log('restore category from cache***');
            isCategoryExist=cachedCategories;
        }else{
            isCategoryExist= await db.Categories.findByPk(categoryId);
            await redis.set(`category:${categoryId}`, JSON.stringify(isCategoryExist));
        }

        if (!isCategoryExist){
            return res.status(400).json({message:'category not found'});
        }
    
        const newproduct = await db.Products.create({
            title: title,
            description: description, 
            price: price,
            coverId:coverId
        });

         // cache key = product:[id]
        await redis.set(`product:${newproduct.id}`, JSON.stringify(newproduct));

        const productcategory= await db.ProductCategories.create({
            productId:newproduct.id,
            categoryId:categoryId
        });
        // cache key = productCategory:[productId]:[categoryId]
        // Caching
        await redis.set(`productCategory:${newproduct.id}:${categoryId}`, JSON.stringify(productcategory));

        res.status(201).json({ message: 'File uploaded and processed successfully', newproduct , productcategory});
    } catch (error) {
        res.status(500).json({ message: 'Failed to process the image.', error: error.message });
    };
}
exports.addProduct2=async(req, res)=>{

    const {title, description, price, coverId, categoryId}=req.body;

    if(!coverId){
        return res.json({message:"please upload image!"});
    }

    const schema = Joi.object({
        coverid: Joi.number().integer().required(),
        price: Joi.number().required(),
        categoryId : Joi.number().integer().required(),
    });
    
    const {error} = schema.validate({ 
        coverid: coverId ,
        price:price,
        categoryId:categoryId
    });
    if(error){
        return res.status(400).json({message:error.message});
    }

    try {
    
        const newproduct = await db.Products.create({
            title: title,
            description: description, 
            price: price,
            coverId:coverId
        });
        const productcategory= await db.ProductCategoryPaths.create({
            productId:newproduct.id,
            categoryId:categoryId
        });

        res.status(201).json({ message: 'File uploaded and processed successfully', newproduct , productcategory});
    } catch (err) {
        res.status(500).json({ message: 'Failed to process the image.', error: err.message });
    };
}

exports.addFavourite=async(req, res)=>{
    const {productId} = req.params;
    const userId = req.user.userId;

    const schema = Joi.object({
        id: Joi.string().pattern(/^\d+$/).required(), // only integer
    });
    const {error} = schema.validate({ id: productId });
    if(error){
        return res.status(400).json({message:"Invalid format, id must be an integer!"});
    }
    
    try{
        // cache key = favourite:[userId]:[productId]
        const cachedFavourite=await redis.get(`favourite:${userId}:${productId}`);
        
        let favourite;
        if(cachedFavourite){
            favourite=JSON.parse(cachedFavourite);
        }else{
            favourite = await db.FavouriteProducts.findOne({
                where:{
                    userId:userId,
                    productId:productId,
                }
            });
        }
        if(favourite){
            await favourite.destroy();
            await redis.del(`favourite:${userId}:${productId}`);
            return res.status(202).json({message:"removed from favourite."});
        }else{
            // cache key = product:[productId]
            let product = await redis.get(`product:${productId}`);
            if(!product){
              product=await db.Products.findOne({where:{id:productId}});  
            }
            if(!product){
                return res.status(404).json({message:"no product was found for this ID"});
            }
            const addfavourite =await db.FavouriteProducts.create({
                productId:productId,
                userId:userId
            });
            await redis.set(`favourite:${userId}:${productId}`, addfavourite);
            res.status(201).json({message:"added to favourite!", addfavourite});
        }
    }catch(err){
        console.log(err.message);
        res.status(500).json({message:err.message});
    }
}

exports.oneProduct=async(req, res)=>{
    const {productId}=req.params;
    // cache key = product:[id]
    
    const schema = Joi.object({
        id: Joi.string().pattern(/^\d+$/).required(), // only integer
    });
    const {error} = schema.validate({ id: productId });
    if(error){
        return res.status(400).json({message:"Invalid format, id must be an integer!"});
    }

    try{
        const iscached = await redis.get(`product:${productId}`);
        
        let product;
        if(iscached){
            console.log('restored from cache');
            return res.status(200).json(JSON.parse(iscached));
            product =iscached;
        }else{

            product= await db.Products.findOne({
                where:{id: parseInt(productId, 10)},
                attributes: { exclude: ['createdAt','updatedAt'] },
                include:[
                    {
                        model:db.ProductCovers,
                        as: 'cover',
                        attributes:['name'],
                    },
                    {
                        model: db.Categories,
                        required: true,
                        as: 'categories',
                        attributes: { exclude: ['createdAt','updatedAt'] },
                        include: [
                            {
                                model: db.Categories,
                                as: 'parent',
                                attributes: { exclude: ['createdAt','updatedAt','id',] },
                            }],
                    },
                    {
                        model: db.ProductAttributes,
                        as: 'attributeValues',
                        attributes: { exclude: ['createdAt','updatedAt'] },
                        
                        include: [
                            {
                            model: db.CategoryAttributeValues,
                            //   as: 'attribute', 
                            attributes: { exclude: ['createdAt','updatedAt'] },
                            
                            },
                        ],
                    },
                    
                    ],
                
            });
            if(!product){
                return res.json({message:"no product was found for this ID"})
            }
            
            await redis.set(`product:${productId}`, JSON.stringify(product));

            
        }
        return res.status(200).json(product);
        
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.getFavourites=async(req, res)=>{
    
    try{
        // Cache key : favourites:[userId]
        const cached = await redis.get(`favourites:${req.user.userId}`);
        if(cached){
            console.log('restore from cache');
            return res.status(200).json(JSON.parse(cached));
        }else{
            const favourites =await db.FavouriteProducts.findAll({
                where:{
                    userId: req.user.userId,
                },
                include: [{
                    model: db.Products,
                    required: true
                }]
            });
            
            await redis.set(`favourites:${req.user.userId}`, JSON.string(favourites));
            return res.status(200).json(favourites);
            
        }
    }catch(err){
        return res.status(500).json({message:err.message});
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
exports.getAttributesByCategory=async(req, res)=>{
    
    // cache key = attributes:[categoryId]
    const { categoryId }=req.query;
        
        const schema = Joi.object({
            categoryId: Joi.number().integer().required().messages({
                'number.base': 'categoryId must be a number.',
                'number.integer': 'categoryId must be an integer.',
                'number.required': 'categoryId is required.',
            }),
        });
        const { error, value } = schema.validate({
            categoryId:categoryId,
        });
        if(error){
            return res.status(400).json({message:error.details[0].message});
        }

    try{
        // cache key = category:[categoryId]
        const cachedCategories=await redis.get(`category:${categoryId}`);
        let isCategoryExist;
        
        // check for cache
        if(cachedCategories){
            console.log('restore category from cache***');
            isCategoryExist=cachedCategories;
        }else{
            isCategoryExist= await db.Categories.findByPk(categoryId);
            await redis.set(`category:${categoryId}`, JSON.stringify(isCategoryExist));
        }

        //check for existence in db
        if (!isCategoryExist){
            return res.status(400).json({message:'category not found'});
        }

        const cachedAttributes= await redis.get(`attributes:${categoryId}`);
        if(cachedAttributes){
            console.log('restore from cache');
            return res.status(200).json(JSON.parse(cachedAttributes));
        }else{

            const attributes= await db.CategoryAttributeValues.findAll({
                where:{
                    categoryId:categoryId
                },
                include:[{
                    model:db.Attributes,
                    as: 'attribute',
                    attributes: { exclude: ['createdAt','updatedAt'] },
                },
                {
                model:db.Categories,
                as: 'category',
                attributes: ['name'],
                attributes: { exclude: ['createdAt','updatedAt'] },
                }]
            }); 
            
            var minprice = await db.Products.findAll({
                order: [['price', 'ASC']], // ASC for min , DESC for max
                limit: 1,
                attributes:['price'],
                include:[{
                    model: db.Categories,
                    as: 'categories',
                    attributes:[],
                    where:{ id:categoryId }}]
                });
            var maxprice = await db.Products.findAll({
                order: [['price', 'DESC']], // Sort by price in descending order
                limit: 1,
                attributes:['price'],
                include:[{
                    model: db.Categories,
                    as: 'categories',
                    attributes:[],
                    where:{ id:categoryId }}]
            });

            if(minprice.lenght===0 || maxprice.length===0){
                maxprice=0;
                minprice=0;
            }
            const attributesOfCategory={};
            attributes.forEach(attrValue=>{
                if(!attributesOfCategory[attrValue.attribute.name]){
                    attributesOfCategory[attrValue.attribute.name]=[];
                }
                attributesOfCategory[attrValue.attribute.name].push(attrValue.value);
            });
            
            await redis.set(`attributes:${categoryId}`, JSON.stringify({attributesOfCategory, minprice:minprice, maxprice:maxprice}));
            // redis.set(`attributes:${categoryId}`,JSON.stringify({attributesOfCategory, minprice:minprice, maxprice:maxprice}));
            return res.status(200).json({attributesOfCategory, minprice:minprice, maxprice:maxprice});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

exports.productByAttribute=async(req, res)=>{

    const {categoryId, attributeId, arrayvalues, minPrice, maxPrice} =req.query;
    const valuesArray = Array.isArray(arrayvalues) ? arrayvalues : [arrayvalues];
    const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];
    const attributeIds = Array.isArray(attributeId) ? attributeId : [attributeId];

    console.log(req.query);
    

    const schema = Joi.object({
        categoryId: Joi.array()
        .items(Joi.number().integer())
        .required() // Optional: Add this if you want to require the array
        .messages({
            'array.base': 'attributeId must be an array.',
            'array.includes': 'attributeId must contain only integers.',
            'array.required': 'attributeId is required.',
        }),
        attributeId: Joi.array()
        .items(Joi.number().integer())
        .required() // Optional: Add this if you want to require the array
        .messages({
            'array.base': 'categoryId must be an array.',
            'array.includes': 'categoryId must contain only integers.',
            'array.required': 'categoryId is required.',
        }),
        arrayvalues:Joi.array()
        .items(Joi.string())
        .required() // Optional: Add this if you want to require the array
        .messages({
            'array.base': 'arrayvalues must be an array.',
            'array.includes': 'arrayvalues must contain only strings.',
            'array.required': 'arrayvalues is required.',
        }),
        minPrice: Joi.number().precision(2).positive().optional(), 
        maxPrice: Joi.number().precision(2).positive().optional(),
    });

    const { error, value } = schema.validate({
        categoryId:categoryIds,
        attributeId:attributeIds,
        arrayvalues:valuesArray,
        minPrice:minPrice,
        maxPrice:maxPrice,
    });
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    let priceWhereClause;
    if (minPrice !== undefined && maxPrice !== undefined) {
        priceWhereClause = {
            [Op.and]: [
                { price:{ [Op.gte]: parseFloat(minPrice)} },
                { price: {[Op.lte]: parseFloat(maxPrice)} }
            ]
        };
    }else if(minPrice || maxPrice){
       priceWhereClause = {
        ...(minPrice !== undefined && { price: { [Op.gte]: parseFloat(minPrice) } }), 
        ...(maxPrice !== undefined && { price: { [Op.lte]: parseFloat(maxPrice) } }),
        };
    }else{
        priceWhereClause={};
    }
    
    try{
        const attributevalues= await db.CategoryAttributeValues.findAll({
            where:{
                [Op.and]:[
                    {categoryId:{[Op.in]:categoryIds}},
                    {attributeId:{[Op.in]:attributeIds}},
                    {value:{[Op.in]:valuesArray}}
                ]
            }
        });

        const attributevalueIds=[];
        attributevalues.forEach(attrvalue=>{
            attributevalueIds.push(attrvalue.id);
        });
        
        const product = await db.Products.findAll({
            attributes: { exclude: ['createdAt','updatedAt'] },
            where:priceWhereClause,
            include: [
                {
                    model: db.Categories,
                    // required: true,
                    as: 'categories',
                    attributes: { exclude: ['createdAt','updatedAt'] },
                    
                    include: [
                        {
                            model: db.Categories,
                            as: 'parent',
                            attributes: { exclude: ['createdAt','updatedAt','id',] },
                        }
                    ],
                },
                {
                    model: db.ProductAttributes,
                    as: 'attributeValues',
                    required: true,
                    attributes: { exclude: ['createdAt','updatedAt', 'productId'] },
                    where:{
                        attributeValueId:{
                            [Op.in]:attributevalueIds
                        }
                    },
                    include: [
                        {
                        model: db.CategoryAttributeValues,
                        attributes: { exclude: ['createdAt','updatedAt'] },
                        include:[{
                            model:db.Attributes,
                            attributes: { exclude: ['createdAt','updatedAt'] },
                            as: 'attribute',
                            
                        }]
                      
                    },
                  ],
                }
              ],
        });
        return res.status(200).json(product);

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

exports.addNewAttribute=async(req ,res)=>{

    const { attributeName }=req.body;
    try{
        const newAttribute=await db.Attributes.create({
            name:attributeName
        });
        return res.status(201).json(newAttribute);

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}
exports.updateAttribute=async(req, res)=>{

    const {attributeId, newName}=req.body;
    try{
        const modifiedAttribute=await db.Attributes.update(
            {name:newName},
            {
                where:{
                id:attributeId,
            }
        });
        return res.status(201).json(modifiedAttribute);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}
exports.addAttributeValue=async(req, res)=>{

    const {attributeId, categoryId, thevalue} =req.body;
    const schema = Joi.object({
        categoryId: Joi.number().integer().required().messages({
            'number.base': 'categoryId must be a number.',
            'number.integer': 'categoryId must be an integer.',
            'number.required': 'categoryId is required.',
        }),
        attributeId: Joi.number().integer().required().messages({
            'number.base': 'attributeId must be a number.',
            'number.integer': 'attributeId must be an integer.',
            'number.required': 'attributeId is required.',
        }),
        thevalue: Joi.string().required().messages({
            'string.empty': 'value is required',
            'any.required': 'value is required'
        }),
    });
    const { error, value } = schema.validate({
        categoryId:categoryId,
        attributeId:attributeId,
        thevalue:thevalue,
    });
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    try{
        const newAttributeValue= await db.CategoryAttributeValues.create({
            attributeId:attributeId,
            categoryId:categoryId, 
            value:thevalue 
        });
        return res.status(201).json(newAttributeValue);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}
exports.addCategory=async(req, res)=>{
    const { name, parentId } =req.body;
    
    const schema = Joi.object({
        parentId: Joi.number().integer().default(null).messages({
            'number.base': 'parentId must be a number.',
            'number.integer': 'parentId must be an integer.',
        }),
        name: Joi.string().required().messages({
            'string.empty': 'name is required',
            'any.required': 'name is required'
        }),
    });
    const { error, value } = schema.validate({
        parentId:parentId,
        name:name,
    });
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    try{
        const newCategory=await db.Categories.create({
            name:value.name, 
            parentId:parentId,
        });
        // cache key = category[categoryId]
        await redis.set(`category:${newCategory.id}`, JSON.stringify(newCategory));

        const categories = await db.Categories.findAll({
            include: [{
            model: db.Categories,
            as: 'children',
            }]
        });
        await redis.set('categories', JSON.stringify(categories));


        return res.status(201).json(newCategory);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}
exports.updateCategory=async(req, res)=>{
    const {name, parentId, categoryId}=req.body;

    try{ 
        // cache key = category[categoryId]
        const cachedOldCategory= await redis.get(`category:${categoryId}`);
        let theOldCategory
        if(!cachedOldCategory){
            theOldCategory = await db.Categories.findByPk(categoryId);
            if(!theOldCategory){
                return res.status.json({message:'category was not found'});
            }
        }else{
            console.log(cachedOldCategory);
            theOldCategory=JSON.parse(cachedOldCategory);
        }

        let newName=theOldCategory.name;
        let newParentId=theOldCategory.parentId;
        if(name){
            newName=name;
        }
        if(parentId){
            newParentId=parentId;
        }

        console.log(name, parentId);
        await db.Categories.update(
            {
                name:newName,
                parentId:parentId,
            },{
                where:{
                    id:categoryId,
                }
            }
        );
        
        const newCategory =await db.Categories.findByPk(categoryId);
        await redis.set(`category:${categoryId}`, JSON.stringify(newCategory));
        
        const categories=await db.Categories.findAll();
        await redis.set('categories', JSON.stringify(categories));

        return res.status(201).json(newCategory);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

exports.addAttributeValueToProduct=async(req, res)=>{
    const {productId, attributeValueId}=req.body;

    try{
        const productAttribute = await db.ProductAttributes.create({
            productId:productId, 
            attributeValueId:attributeValueId,
        });

        const product= await db.Products.findOne({
            where:{ id: productId },
            attributes: { exclude: ['createdAt','updatedAt'] },
            include:[
                {
                    model:db.ProductCovers,
                    as: 'cover',
                    attributes:['name'],
                },
                {
                    model: db.Categories,
                    required: true,
                    as: 'categories',
                    attributes: { exclude: ['createdAt','updatedAt'] },
                    include: [
                        {
                            model: db.Categories,
                            as: 'parent',
                            attributes: { exclude: ['createdAt','updatedAt','id',] },
                        }],
                },
                {
                    model: db.ProductAttributes,
                    as: 'attributeValues',
                    attributes: { exclude: ['createdAt','updatedAt'] },
                    
                    include: [
                        {
                        model: db.CategoryAttributeValues,
                        //   as: 'attribute', 
                        attributes: { exclude: ['createdAt','updatedAt'] },
                        
                        },
                    ],
                },
                
                ],
            
        });
        await redis.set(`product:${productId}`, JSON.stringify(product));

        return res.status(201).json({productAttribute, product});

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

exports.caching=async(req, res)=>{
    try{
        const obj={'1':'a', '2':'b'};
        // await redis.del('cache');
        const cached = await redis.get('cache');

        
        if(cached){
            console.log('from cache');
            return res.json(JSON.parse(cached));
        }
        else{
            const cat= await db.Categories.findAll({attributes:['id', 'name']});
            await redis.set('cache',JSON.stringify(cat));
           
            console.log('from obj');
            return res.json(cat);
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}