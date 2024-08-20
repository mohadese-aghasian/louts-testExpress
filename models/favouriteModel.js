const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const FavouriteProduct=sequelize.define("FavouriteProduct",{
    user:{},
    product:{},
})