module.exports = (sequelize, DataTypes) =>{
    const ProductGallery=sequelize.define('ProductGallery', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
        productId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"Products",
                key:'id'
            }
        },
        path:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    });
    ProductGallery.associate=(models)=>{
        // ProductGallery.belongsToMany(models.Products, {foreignKey:"productId"});
    }
    return ProductGallery;
    
}