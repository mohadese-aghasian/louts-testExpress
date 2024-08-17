require("dotenv").config();
const express = require("express");
const bodyparser= require('body-parser');
const blogrouter=require("./routes/routerv1");
const sequelize = require('./models/index');


const app= express();
const port=3000;

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

//sequelize.sync({ force: true }).then(() => {
//    console.log("Database & tables created!");
//});


app.get("/", (req, res)=>{
    res.json({data:"home"});
});
//app.use(authenticateJWT);
app.use('/api/v1', blogrouter);


//sequelize.sync({ force: true }).then(() => {
//    console.log("Database & tables created!");
//});




app.listen(port, ()=>{
    console.log(`server running on port ${port}.`);
});