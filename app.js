require("dotenv").config();
const express = require("express");
const bodyparser= require('body-parser');
const ejs = require("ejs");
const mongoose=require('mongoose');
const blogrouter=require("./routes/router");
const passport = require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const session =require("express-session");


const app= express();
const port=3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(session({
    secret: "my little secret",
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());
/////////  Database
mongoose.connect(process.env.MONGOURL);

////////////

app.get("/", (req, res)=>{
    res.render("home");
});

app.use('/blogs', blogrouter);


app.listen(port, ()=>{
    console.log(`server running on port ${port}.`);
});