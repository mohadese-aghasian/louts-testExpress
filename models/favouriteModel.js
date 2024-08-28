module.exports = (sequelize, DataTypes) =>{
    
const FavouriteProducts=sequelize.define("FavouriteProducts",{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:'Users',
            key: 'id'
        }
    },
    productId:{
        type:DataTypes.INTEGER,
        references:{
            model:'Products',
            key:"id"
        }
    },
});
    FavouriteProducts.associate=(models)=>{
        FavouriteProducts.belongsTo(models.Products,{foreignKey:"productId"});
        FavouriteProducts.belongsTo(models.Users, {foreignKey:"userId", as:"User"});
    }
    return FavouriteProducts;
}

