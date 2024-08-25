const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User= require("./userModel");

const Cart=sequelize.define("Cart", {
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key: 'id'
        }
    },
});

module.exports=Cart;