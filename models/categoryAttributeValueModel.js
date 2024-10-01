
module.exports=(sequelize,DataTypes)=>{
    const CategoryAttributeValue=sequelize.define("CategoryAttributeValues", {
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
        categoryId:{
          type:DataTypes.INTEGER,
          references:{
            model:'Categories',
            key:'id'
          }
        },
        value:{
            type:DataTypes.STRING,
            allowNull:false,
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

    CategoryAttributeValue.associate = (models) =>{

      // CategoryAttributeValue.belongsTo(models.Categories, {
      //   foreignKey:'cateoryId',
      //   as: 'categories',
      //   });

      CategoryAttributeValue.belongsTo(models.Attributes, {
         foreignKey: 'attributeId' ,
          as: 'attribute'
        });
      CategoryAttributeValue.hasMany(models.ProductAttributes, {
        foreignKey: 'attributeValueId',
        // as: 'productAttributes'
      });
      
      CategoryAttributeValue.belongsTo(models.Categories, {
        foreignKey: 'categoryId',
        as: 'category'
      })


    }
    
    
    
    return CategoryAttributeValue;
  }
