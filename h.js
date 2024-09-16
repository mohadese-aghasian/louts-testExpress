const { where } = require("sequelize");
const db=require("./models/index");
const { Op } = require('sequelize');
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
  
// for(var i =5; i<=16; i=i+2) {
//     const productExists =  db.Products.findOne({
//         where: { id: i }
//       });
//       if (!productExists) {
//         continue;}  
//     db.ProductCategoryPaths.create({
//         productId:i,
//         // categoryId:Math.floor(Math.random()*8)+1
//         categoryId:8,
//     });
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
var searchText='Lander is the trademarked name of';
const words = searchText.split(' ');
console.log(words.map(word => `%${word}%`));
const wordByWordSearchResults = db.Products.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: { [Op.any]: words.map(word => `%${word}%`) }
          }
        },
        {
          description: {
            [Op.iLike]: { [Op.any]: words.map(word => `%${word}%`) }
          }
        }
      ]
    }
  });
  console.log(JSON.stringify(wordByWordSearchResults));
  