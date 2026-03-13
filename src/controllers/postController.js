const postModel = require("../models/post.model");
const Imagekit = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");


const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPost(req, res) {

  const file = await imagekit.files.upload({
    file: req.file.buffer.toString("base64"),
    fileName: "test",
    folder: "insta-clone-posts",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
}

async function getPost(req, res) {
  
  const userId = req.user.id;
  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
}

async function getPostDetail(req, res) {
  
  const userId = req.user.id;
  const postId = req.params.postId;


  const post = await postModel.findById(postId)

  if(!post)
  {
    return res.status(404).json({
        message : "Post not found "
    })
  }

  const isValidUser = post.user.toString() === userId;

  if(!isValidUser)
  {
    return res.status(403).json({
      message : "Forbidden Content" 
    })
  }

  return res.status(200).json({
    message : "Post fetched successfully",
    post
  })
}

async function likePostController(req,res)
{
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId)

  if(!post)
  {
    return res.status(404).json({
      message : "Post not found."
    })
  }
  const like = await likeModel.create({
    post : postId,
    user : username
  })

  res.status(200).json({
    message : "Post liked successfully",
    like
  })
}


module.exports = {
  createPost,
  getPost,
  getPostDetail,
  likePostController
};
