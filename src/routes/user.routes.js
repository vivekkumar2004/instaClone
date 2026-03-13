const express = require('express');
const identifyUser = require('../middleware/auth.middleware');
const { followController, unfollowUserController, acceptFollowRequest, rejectFollowRequest } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post("/follow/:username",identifyUser,followController);

userRouter.post("/unfollow/:username", identifyUser, unfollowUserController)

userRouter.post("/accept/:username",identifyUser,acceptFollowRequest)

userRouter.post("/reject/:username",identifyUser,rejectFollowRequest)

module.exports = userRouter;