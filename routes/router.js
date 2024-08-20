const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const Controller = require('../controllers/controller');

router.post("/login", Controller.login);
router.post("/register", Controller.register);
router.get('/logout', authenticateJWT, Controller.logout);

router.post("/blogs", authenticateJWT, Controller.createBlog);
router.get("/blogs", authenticateJWT, Controller.getBlogs);
router.post('/blogs/like/:blogId', authenticateJWT, Controller.likeBlog);
router.get("/blogs/oneblog/", authenticateJWT, Controller.getSingleBlog);

module.exports=router;