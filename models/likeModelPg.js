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

// Like.belongsTo(Blog, { foreignKey: 'blogId' });
// Like.belongsTo(User, { foreignKey: 'userId' });
Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId' });
    Like.belongsTo(models.Blog, { foreignKey: 'blogId' });
};

module.exports = Like;
