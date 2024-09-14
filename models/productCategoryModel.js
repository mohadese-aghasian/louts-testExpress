
// module.exports = (sequelize, DataTypes) =>{
//     const ProductCategory = sequelize.define('ProductCategories', {
//         id: {
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true,
//             type: DataTypes.INTEGER
//           },
//         productId:{
//             type:DataTypes.INTEGER,
//             references:{
//               model:"Products",
//               key:"id"
//             },
//             allowNull:false
//           },
//         categoryId:{
//             type:DataTypes.INTEGER, 
//             references:{
//               model:"Categories",
//               key:"id"
//             },
//             allowNull:false
//           },
//         createdAt: {
//             allowNull: false,
//             type: DataTypes.DATE,
            
//           },
//         updatedAt: {
//             allowNull: false,
//             type: DataTypes.DATE,
            
//           }
//     });
//     ProductCategory.associate=(models)=>{
//       ProductCategory.belongsTo(models.Products, { foreignKey: 'productId' });
//       ProductCategory.belongsTo(models.Categories, { foreignKey: 'categoryId' });
        
//     };
//     return ProductCategory;
// };

module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('ProductCategories', {
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id',
      },
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id',
      },
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  ProductCategory.associate = (models) => {
    ProductCategory.belongsTo(models.Products, { foreignKey: 'productId' });
    ProductCategory.belongsTo(models.Categories, { foreignKey: 'categoryId' });
  };

  return ProductCategory;
};
