module.exports = (sequelize, DataTypes) => {
    const ProductCategoryPath = sequelize.define('ProductCategoryPaths', {
        productId:{
            type:DataTypes.INTEGER,
            references:{
            model:"Products",
            key:"id"
            },
            allowNull:false
        },
        categoryId:{
            type:DataTypes.INTEGER, 
            references:{
            model:"CategoryPaths",
            key:"id"
            },
            allowNull:false
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
  
    ProductCategoryPath.associate = (models) => {
      ProductCategoryPath.belongsTo(models.Products, { foreignKey: 'productId', as:'category' });
      ProductCategoryPath.belongsTo(models.CategoryPaths, { foreignKey: 'categoryId' });
    };
  
    return ProductCategoryPath;
  };
