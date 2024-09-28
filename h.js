const { where, Model } = require("sequelize");
const db=require("./models/index");
const { Op } = require('sequelize');
const { faker, el } = require('@faker-js/faker');
const { json } = require("body-parser");
const { Json } = require("sequelize/lib/utils");

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
// for(var i =1; i<=222; i++) {

//     const productExists =  db.ProductCategories.findOne({
//         // include:[{
//         //     model: db.Categories,
//         //     required: true,
//         //     as: 'categories',
//         //     attributes: { exclude: ['createdAt','updatedAt'] },
//         // }],
//         where: { id: i }
//       });
//       if (!productExists) {
//         continue;} 
//         // console.log(JSON.stringify(productExists));
//         // console.log(productExists);
//         if(categoryId==4){
//             const catattv=d.CategoryAttributeValues.findAll
//         }

     
        
    
 
// }
// const generateProductAttributes = async () => {
//     try {
//     const products = await db.Products.findAll({
//         include:[{
//             model: db.Categories,
//             required: true,
//             as: 'categories',
//             attributes: { exclude: ['createdAt','updatedAt'] },
//         }],
//     });
//     for(const product of products){
//         const categoryId = product.categories[0].id;
//         const categoryAttributeValues = await db.CategoryAttributeValues.findAll({
//             where: { categoryId }
//         });
//         if (categoryAttributeValues.length === 0){
//             continue;
//         }
//         // if(categoryId==5){
//         // console.log(JSON.stringify(categoryAttributeValue[0].value));}
//         const randomIndex = Math.floor(Math.random() * categoryAttributeValues.length);
//         const selectedAttributeValue = categoryAttributeValues[randomIndex];
//         // console.log(v);
//         const ww= await db.ProductAttributes.findOne({
//             where:{
//                 productId: product.id,
//                 attributeValueId:selectedAttributeValue.id,
//             }
//         });
//         if(ww){
//             continue;
//         }
//         await db.ProductAttributes.create({
//             productId: product.id,
//             attributeValueId:selectedAttributeValue.id,
//         });
//     }


//     console.log('Product attributes generated successfully!');
//     } catch (error) {
//     console.error('Error generating product attributes:', error);
//     }
// }
// generateProductAttributes();
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
// db.CategoryAttributeValues.destroy({
//   where:{
//     id:{[Op.between]:[34,50]}
//   }
// });
// const {count,rows}= db.CategoryAttributeValues.findAndCountAll({where:{attributeId:2}});

// for(var i=17; i<=24; i++){
//     faker.seed(i);
//     if(i==17 || i==18||i==19){
//         // if(i==17){
//         //     var value='6.5 inches';
//         // }
//         // else{
//         //     var value='6 inches';
//         // }
//         db.CategoryAttributeValues.update(
//             {
//                 categoryId:4,
//                 attrtibuteId:3,
//                 value:faker.company.name(),
//             },{
//                 where:{
//                     id:i
//                 }
//             }
//         );
//     }
//     else if(i==20||i==21){
//         // if(i==30){
//         //     var value='16 inches';
//         // }
//         // else{
//         //     var value='15 inches';
//         // }
//         db.CategoryAttributeValues.update(
//             {
//                 categoryId:5,
//                 attrtibuteId:3,
//                 value:faker.company.name(),
//             },{
//                 where:{
//                     id:i
//                 }
//             }
//         );
//     }
//     // else if(i<=22 & i>=24){
//     //     if(i==31){
//     //         var value='small';
//     //     }
//     //     else{
//     //         var value='larg';
//     //     }
//     //     db.CategoryAttributeValues.update(
//     //         {
//     //             categoryId:10,
//     //             attrtibuteId:1,
//     //             value:value,
//     //         },{
//     //             where:{
//     //                 id:i
//     //             }
//     //         }
//     //     );
//     // }
//     else{
//         // var size={25:'s', 26:'m', 27:'l'}
//         db.CategoryAttributeValues.update(
//             {
//                 categoryId:9,
//                 attrtibuteId:3,
//                 value:faker.company.name()
//             },{
//                 where:{
//                     id:i
//                 }
//             }
//         );
//     }
    
        
    
// }
// db.CategoryAttributeValues.update(
//     {categoryId:6},
//     {
//         where:{
//             id:6
//         }
//     }

// );