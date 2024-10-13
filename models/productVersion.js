module.exports = (sequelize, DataTypes) => {
    const ProductVersion = sequelize.define('ProductVersions', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
          productId:{
            allowNull:false, 
            type:DataTypes.INTEGER,
            references:{
              model:'Products',
              key:'id'
            },
          },
          version:{
            type:DataTypes.INTEGER,
            allowNull:false,
          },
          changes:{
            type:DataTypes.JSONB,
            allowNull:false,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: false,
            type:DataTypes.DATE,
          },
    },{
      
      indexes: [
          {
              unique: true,
              fields: ['productId', 'version']
          }
      ]
  });
  
    ProductVersion.associate = (models) => {
  
      ProductVersion.belongsTo(models.Products, {
        foreignKey: 'productId',
        as: 'product',
      });

      
    };

    return ProductVersion;
  };