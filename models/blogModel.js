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
        authorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',   
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
    });

    Blogs.associate=(models)=>{
        Blogs.belongsTo(models.Users, { foreignKey: 'userId', as: 'author' });
    };

    return Blogs;
};


