const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Product =sequelize.define('Product', {
    title:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING, 
        allowNull:false,
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    
});

module.exports=Product;