const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Cart= require("./cartModel");
const Product=require("./productModel");

const CartItem=sequelize.define("CartItem", {
    cartId:{
        type:DataTypes.INTEGER,
        references:{
            model:Cart,
            key:"id"
        }
    },
    productId:{
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:"id"
        }
    },
    quantity:{
        type:DataTypes.INTEGER,
        defaultValue:1,
    }
});

module.exports=CartItem;