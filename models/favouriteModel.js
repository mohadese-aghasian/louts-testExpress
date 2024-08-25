const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./userModel');
const Product = require('./productModel');


const FavouriteProduct=sequelize.define("FavouriteProduct",{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key: 'id'
        }
    },
    productId:{
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:"id"
        }
    },
});

module.exports=FavouriteProduct;