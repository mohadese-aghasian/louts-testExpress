module.exports=(sequelize,DataTypes)=>{
    const Attribute=sequelize.define("Attributes", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
        name:{
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
    
    Attribute.associate = (models) =>{
      Attribute.belongsToMany(models.Products, {
        through:models.ProductAttributeValues,
        foreignKey: 'attributeId',
        otherKey: 'productId',
        as:'theproduct',
      });
    }
    
    
    return Attribute;
}