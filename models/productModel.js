// module.exports = (sequelize, DataTypes) =>{
//     const Products =sequelize.define('Products', {
//         title:{
//             type:DataTypes.STRING,
//             allowNull:false,
//         },
//         description:{
//             type:DataTypes.STRING, 
//             allowNull:true,
//         },
//         price:{
//             type:DataTypes.FLOAT,
//             allowNull:false,
//         }, 
//         coverId:{
//             type:DataTypes.INTEGER,
//             allowNull:true, 
//             references:{
//                 model:"ProductCovers",
//                 key:"id",
//             },
//         },

const { Sequelize } = require(".");

        
//     });

//     Products.associate=(models)=>{
//         Products.hasMany(models.ProductGalleries, {
//         foreignKey: 'productId',
//         as: 'galleries'  // Optional alias for easier querying  
//     });
//         Products.belongsTo(models.ProductCovers,{
//         foreignKey:'coverId',
//         as:'cover'
//     });
//     Products.belongsToMany(models.Categories, {
//         through: models.ProductCategories,
//         foreignKey: 'productId',
//         otherKey: 'categoryId',
//         as: 'categories'
//     });
    
//         }
//         return Products;
//     }
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      coverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'ProductCovers',
          key: 'id',
        },
      },
      currentVersion:{
        type:DataTypes.INTEGER,
        defaultValue:0,
      }
    });
  
    Product.associate = (models) => {
      Product.belongsToMany(models.Categories, {
        through: models.ProductCategories,
        foreignKey: 'productId',
        otherKey: 'categoryId',
        as: 'categories',
      });
  
      Product.belongsTo(models.ProductCovers, {
        foreignKey: 'coverId',
        as: 'cover',
      });

      Product.hasMany(models.ProductCategoryPaths, { foreignKey: 'productId' });

      
      Product.hasMany(models.ProductAttributes, { foreignKey: 'productId', as: 'attributeValues' });

      Product.hasMany(models.ProductVersions, { foreignKey: 'productId', as:'versions'});
      //   Product.belongsToMany(models.Attributes, {
      //     through: models.ProductAttributeValues,
      //     foreignKey: 'productId',
      //     otherKey: 'attributeId',
      //     as: 'attributes', 
      // });


    };

    return Product;
  };
  