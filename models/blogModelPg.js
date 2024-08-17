const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./userModelPg');

const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = Blog;
