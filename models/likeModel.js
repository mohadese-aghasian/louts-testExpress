module.exports = (sequelize, DataTypes) =>{
    
const Likes = sequelize.define('Likes', {
    blogId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Blogs',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

    Likes.associate=(models)=>{
        Likes.belongsTo(models.Blogs, { foreignKey: 'blogId'});
        Likes.belongsTo(models.Users, { foreignKey: 'userId' });
    };
    return Likes;
}
