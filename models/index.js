const { Sequelize } = require('sequelize'); // ORM for node js to interacting with db


const sequelize = new Sequelize('userblogdb', 'postgres', 'postgres76555432', {
    host: 'localhost',
    dialect: 'postgres',
});


module.exports=sequelize;