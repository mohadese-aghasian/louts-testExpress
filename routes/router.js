const express= require("express");
const router=express.Router();
const Controller=require("../controllers/controller");

router.get("/all",async(req, res)=>{
    res.send("get all");
});

router.get("/login",Controller.viewLogin);
router.post("/login", Controller.loginUser);

router.get("/logout", Controller.logout);

router.get("/register", Controller.viewRegister);
router.post("/register", Controller.registerUser);

router.post("/newblog", Controller.createNewBlog);
router.get("/allblogs", Controller.getAllBlogs); // TO REMOVE OR GHANGE FOR LIMITING ACCESS

router.post("/allblogs/like/:blogid", Controller.likeBlog);




module.exports=router;