module.exports = (sequelize, DataTypes) =>{
    const ProductGalleries=sequelize.define('ProductGalleries', {
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
    ProductGalleries.associate=(models)=>{
        // ProductGallery.belongsToMany(models.Products, {foreignKey:"productId"});
    }
    return ProductGalleries;
    
}