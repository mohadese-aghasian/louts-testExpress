const { truncate } = require("fs");

module.exports = (sequelize, DataTypes) =>{
    const Blogs = sequelize.define('Blogs', {
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        likeNum:{
            type:DataTypes.INTEGER, 
            defaultValue:0,
        },
        authorId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'Users',   
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
    });

    Blogs.associate=(models)=>{
        Blogs.belongsTo(models.Users, { foreignKey: 'authorId' });
    };

    return Blogs;
};


