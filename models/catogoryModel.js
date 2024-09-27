// const { truncate } = require("fs");

// module.exports = (sequelize, DataTypes) =>{
//     const Category = sequelize.define('Categories', {
//         id: {
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true,
//             type: DataTypes.INTEGER
//           },
//         name:{
//             allowNull:false,
//             type:DataTypes.STRING,
//             unique:true, 
//           },
//         parentId:{
//           type:DataTypes.INTEGER,
//           defaultValue:null,
//           references:{
//             model:"Categories",
//             key:'id'
//           }
//         },
//         createdAt: {
//             allowNull: false,
//             type: DataTypes.DATE,
            
//           },
//         updatedAt: {
//             allowNull: false,
//             type: DataTypes.DATE,
            
//           }
//     });
//     Category.associate=(models)=>{
//       Category.belongsToMany(models.Products, {
//           through: models.ProductCategories,
//           foreignKey: 'categoryId', 
//           otherKey: 'productId',
//           as: 'products'
//       });

//       Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
//       Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

//     };

//     return Category;
// };


module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Categories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
  });

  Category.associate = (models) => {

    Category.belongsToMany(models.Products, {
      through: models.ProductCategories,
      foreignKey: 'categoryId',
      otherKey: 'productId',
      as: 'products',
    });

    Category.belongsTo(Category, {
      foreignKey: 'parentId',
      as: 'parent',
    });

    Category.hasMany(Category, {
      foreignKey: 'parentId',
      as: 'children',
    });

    Category.hasMany(models.CategoryAttributeValues, {
      foreignKey: 'categoryId',
      as: 'attributes'
    });



  };

  return Category;
};
