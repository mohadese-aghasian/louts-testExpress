const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./userModelPg');
const Blog = require('./blogModelPg');

const Like = sequelize.define('Like', {
    blogId: {
        type: DataTypes.INTEGER,
        references: {
            model: Blog,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
});

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Blog, { foreignKey: 'blogId' });

module.exports = Like;
