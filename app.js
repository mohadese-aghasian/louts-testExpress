const express = require("express");
const bodyparser= require('body-parser');
const blogrouter=require("./routes/router");
const productRouter=require("./routes/productRouter");
const userRouter=require("./routes/userRouter");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const cors= require("cors");
const { compare } = require("bcryptjs");

/////////////////
// require("dotenv").config(
//     {
//          path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
//     }
// );
// const { Sequelize } = require('sequelize'); // ORM for node js to interacting with db

// const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
//     host: 'localhost',
//     dialect: 'postgres',
// });
// module.exports=sequelize;
////////////////////////////////////
const app= express();
const port=3000;

app.use(cors());

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

app.get("/", (req, res)=>{
    res.json({data:"home"});
});

//app.use(authenticateJWT);
app.use('/api/v2', blogrouter);
app.use('/api/v3', productRouter);
app.use('/api/v1', userRouter);



// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// sequelize.sync({ force: true }).then(() => {
//    console.log("Database & tables created!");
// });
// sequelize.sync({ alter: true });


app.listen(port, ()=>{
    console.log(`server running on port ${port}.`);

});