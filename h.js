const { where, Model } = require("sequelize");
const db=require("./models/index");
const { Op } = require('sequelize');
const { faker } = require('@faker-js/faker');

// const results = {
//     fullText: fullTextResults.map(product => product.id),
//     wordByWord: wordByWordResults.map(product => product.id)
//   };
  
//   // Remove duplicates
//   const uniqueResults = Array.from(new Set([...results.fullText, ...results.wordByWord]));
  
//   // Fetch full details of unique results
//   const finalResults = await Product.findAll({
//     where: {
//       id: uniqueResults
//     }
//   });
// var n;
// var size=[['s','l'],['l','xl','xxl'],['xl', 'xxl']];
// var brand=[['samsung','apple'],['xiaomi','asus','lenovo'],['bosh','LG']];
// for(var i =91; i<=222; i++) {
//   n=Math.floor(Math.random()*3)+1;
//     const productExists =  db.Products.findOne({
//         where: { id: i }
//       });
//       if (!productExists) {
//         continue;}  
        
//       if(n===1){
//         const p = db.ProductAttributeValues.create({
//           productId:i,
//           attributeId:n,
//           value:size[Math.floor(Math.random()*3)],
//       });
//       }else if(n===2){
//         const p = db.ProductAttributeValues.create({
//           productId:i,
//           attributeId:n,
//           value:[faker.color.human(), faker.color.human()],
//       });
//       }else{
//         const p =db.ProductAttributeValues.create({
//           productId:i,
//           attributeId:n,
//           value:brand[Math.floor(Math.random()*3)],
//       });
//       }
    
// }

// for(var i=5; i<221; i++){
//     const productExists =  db.Products.findOne({
//         where: { id: i }
//       });
//       if (!productExists) {
//         continue;}
//         db.Products.update(
//             {coverId:9},{
//                 where:{
//                     coverId:null 
//                 }
//             }
//       )
    
// }

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
 
// db.Attributes.bulkCreate([
//   {name: 'size'},
//   {name: 'color'},
//   {name: 'brand'}
// ]);
// db.ProductAttributeValues.bulkCreate([
//   {attributeId:2, productId:5, value:['yellow','green']},
//   {attributeId:3, productId:6, value:['apple','samsung']},
//   {attributeId:1, productId:7, value:['s','m','l']},
// ]);
// const a=db.ProductAttributeValues.update(
//   {productId:7},
//   {
//     where:{
//       id:3
//     }
//   }
// );
// db.ProductAttributeValues.destroy({
//   where:{
//     id:9
//   }
// });