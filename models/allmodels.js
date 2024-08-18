const { DataTypes } = require('sequelize');
const sequelize = require('./index');


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
    }
});

// Blog.hasMany(Like, { foreignKey: 'blogId', as: 'likecounts'});
Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });


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

Like.belongsTo(Blog, { foreignKey: 'blogId'});
Like.belongsTo(User, { foreignKey: 'userId' });
// Like.associate = (models) => {
//     Like.belongsTo(models.User, { foreignKey: 'userId' });
//     Like.belongsTo(models.Blog, { foreignKey: 'blogId' });
// };

// Blog.hasMany(Like, { foreignKey: 'blogId', as: 'likecounts'});
module.exports={Blog, User, Like};