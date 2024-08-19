const { Sequelize } = require('sequelize'); // ORM for node js to interacting with db



const sequelize = new Sequelize('userblogdb', 'postgres', 'postgres76555432', {
    host: 'localhost',
    dialect: 'postgres',
});


// Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });
// Like.belongsTo(Blog, { foreignKey: 'blogId'});
// Like.belongsTo(User, { foreignKey: 'userId' });


// module.exports = { User, Blog, Like};
module.exports=sequelize;