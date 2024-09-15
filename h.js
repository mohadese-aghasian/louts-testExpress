const { where } = require("sequelize");
const db=require("./models/index");
const { Op } = require('sequelize');

for(var i =5; i<=16; i=i+2) {
    const productExists =  db.Products.findOne({
        where: { id: i }
      });
      if (!productExists) {
        continue;}  
    db.ProductCategoryPaths.create({
        productId:i,
        // categoryId:Math.floor(Math.random()*8)+1
        categoryId:8,
    });
}

// db.ProductCategoryPaths.create({
//             productId:5,
//             categoryId: 11
//         });
// db.CategoryPaths.update({
//     path:'Digital/'},
//     {
//         where:{
//             name:'Digital'
//         }
//     }
// );
// db.CategoryPaths.update({
//     path:'Outfit/'},
//     {
//         where:{
//             name:'Outfit'
//         }
//     }
// );
// db.CategoryPaths.update({
//     path:'Food/'},
//     {
//         where:{
//             name:'Food'
//         }
//     }
// );
// db.CategoryPaths.create({
//     name:'قاب موبایل',
//     path:'Digital/mobile/قاب موبایل/'
// });
// db.CategoryPaths.create({
//     name:'Laptop',
//     path:'Digital/Laptop/'
// });
// db.CategoryPaths.create({
//     name:'Food',
//     path:'Food/'
// });
