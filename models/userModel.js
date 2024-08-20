const { DataTypes } = require('sequelize');
const sequelize = require('./index');


const user= sequelize.define('User', {
    username: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING, 
        validate:{
            isEmail:{
                msg:"must be a valid Email address!"
            }
        },
    }
});


// User.hasMany(Blog, { foreignKey: 'userId' });
// User.hasMany(Like, { foreignKey: 'userId' });
// User.associate = (models) => {
//     User.hasMany(models.Blog, { foreignKey: 'userId' });
//     User.hasMany(models.Like, { foreignKey: 'userId' });
// };
module.exports = user;
