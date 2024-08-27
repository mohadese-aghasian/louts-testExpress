require("dotenv").config();
const express = require("express");
const bodyparser= require('body-parser');
const blogrouter=require("./routes/router");
const sequelize = require('./models/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const cors= require("cors");
const { compare } = require("bcryptjs");


const app= express();
const port=3000;

app.use(cors());

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

app.get("/", (req, res)=>{
    res.json({data:"home"});
});

//app.use(authenticateJWT);
app.use('/api/v1', blogrouter);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// sequelize.sync({ force: true }).then(() => {
//    console.log("Database & tables created!");
// });
//sequelize.sync({ alter: true });


app.listen(port, ()=>{
    console.log(`server running on port ${port}.`);

});