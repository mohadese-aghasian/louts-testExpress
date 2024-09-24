module.exports=(sequelize,DataTypes)=>{
    const ProductAttributeValue=sequelize.define("ProductAttributeValues", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
        attributeId:{
            type:DataTypes.INTEGER,
            references:{
              model:'Attributes',
              key:'id'
            },
            allowNull:false,
          },
        productId:{
            type:DataTypes.INTEGER, 
            references:{
              model:'Products',
              key:'id'
            },
            allowNull:false,
          },
        value:{
            type:DataTypes.ARRAY(DataTypes.STRING),
          },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            
          },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            
          }  
    });

    ProductAttributeValue.associate = (models) =>{


      ProductAttributeValue.belongsTo(models.Products, {
        foreignKey:'productId',
        
        });

      ProductAttributeValue.belongsTo(models.Attributes, { foreignKey: 'attributeId' });

      
    }
    return ProductAttributeValue;
  }
