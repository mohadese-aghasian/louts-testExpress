const { where } = require("sequelize");
const db=require("./models/index");
const { Op } = require('sequelize');

// for(var i =5; i<=150; i++) {
//     const productExists =  db.Products.findOne({
//         where: { id: i }
//       });
//       if (!productExists) {
//         continue;}  
//     db.ProductCategories.create({
//         productId:i,
//         categoryId:Math.floor(Math.random()*9)+2
//     });
// }
db.ProductCategories.create({
            productId:151,
            categoryId: 11
        });
// db.Categories.create({
//     name:'dark',
//     parentId:8
// });
// db.Categories.create({
//     name:'shirt',
//     parseInt:7
// });

// db.Categories.create({
//     name:'Table',
//     parentId:3
// });
