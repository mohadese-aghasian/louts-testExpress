const { DataTypes } = require('sequelize');
const sequelize = require('./index');
// const Blog= require("./blogModelPg");
const Like= require("./likeModelPg");

const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// User.hasMany(Blog, { foreignKey: 'userId' });
// User.hasMany(Like, { foreignKey: 'userId' });
// User.associate = (models) => {
//     User.hasMany(models.Blog, { foreignKey: 'userId' });
//     User.hasMany(models.Like, { foreignKey: 'userId' });
// };
module.exports = User;
