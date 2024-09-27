
module.exports=(sequelize,DataTypes)=>{
    const ProductAttribute=sequelize.define("ProductAttributes", {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
        productId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'Products',
                key:'id',
            }
        },
        attributeValueId:{
            type:DataTypes.INTEGER,
            references:{
              model:'CategoryAttributeValues',
              id:'id'
            },
            allowNull:false,
          },
        createdAt: {
            allowNull: false,
            type:DataTypes.DATE,
          },
        updatedAt: {
            allowNull: false,
            type:DataTypes.DATE,
          } 
    });

    ProductAttribute.associate = (models) =>{

    //   ProductAttribute.belongsTo(models.Categories, {
    //     foreignKey:'cateoryId',
    //     as: 'categories',
    //     });

    //   ProductAttribute.belongsTo(models.Attributes, {
    //      foreignKey: 'attributeId' ,
    //       as: 'attribute'
    //     });

      ProductAttribute.belongsTo(models.CategoryAttributeValues, {
         foreignKey: 'attributeValueId' ,
        //   as: 'attribute'
        });

      ProductAttribute.belongsTo(models.Products, {
         foreignKey: 'productId' ,
        //   as: 'products'
        });


    }
    
        
    return ProductAttribute;
  }
