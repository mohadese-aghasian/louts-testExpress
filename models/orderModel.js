const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User=require("./userModel");


const Order=sequelize.define("Order", {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },

});