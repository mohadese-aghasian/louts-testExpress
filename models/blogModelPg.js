const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./userModelPg');
const Like = require('./likeModelPg');

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

// Blog.hasMany(Like, { foreignKey: 'blogId' });
Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Blog.associate = (models) => {
//     Blog.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
//     Blog.hasMany(models.Like, { foreignKey: 'blogId' });
// };

module.exports = Blog;
