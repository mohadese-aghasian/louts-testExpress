module.exports = (sequelize, DataTypes) =>{
    const Blogs = sequelize.define('Blogs', {
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

    Blogs.associate=(models)=>{
        Blogs.belongsTo(models.Users, { foreignKey: 'userId', as: 'author' });
    };

    return Blogs;
};


