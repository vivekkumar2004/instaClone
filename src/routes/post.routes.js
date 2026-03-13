const express = require("express");
const {createPost, getPost, getPostDetail, likePostController} = require("../controllers/postController");
const multer = require("multer");
const identifyUser = require("../middleware/auth.middleware");
const upload = multer({storage:multer.memoryStorage()})




const postRouter = express.Router();

postRouter.post('/' , identifyUser, upload.single("image"),createPost);

postRouter.get("/", identifyUser, getPost);

postRouter.get("/details/:postId", identifyUser, getPostDetail)

postRouter.post("/like/:postId", identifyUser, likePostController)


module.exports = postRouter;