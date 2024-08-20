const { DataTypes } = require('sequelize');
const sequelize = require('./index');


const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likeNum:{
        type:DataTypes.INTEGER, 
        defaultValue:0,
    }, 
});


// Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });


module.exports = Blog;
