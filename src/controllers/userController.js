const followModel = require('../models/follow.model');
const userModel = require('../models/user.model')

async function followController(req,res) {

    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    if(followeeUsername == followerUsername)
    {
        return res.status(400).json({
            message : "You cannot follow yourself"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee : followeeUsername,  
    })

    if(isAlreadyFollowing)
    {
        return res.status(200).json({
            message : `You are already following ${followeeUsername}`,
            follow : isAlreadyFollowing
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username : followeeUsername
    })

    if(!isFolloweeExists)
    {
        return res.status(404).json({
            message : 'User you are trying to follow doest not exists'
        })
    }

    const followRecord = await followModel.create({
        follower:followerUsername,
        followee : followeeUsername,
        status : "pending"
    })

    res.status(201).json({
        message : `Follow request sent ${followeeUsername}`,
        Follow : followRecord
    })
}

async function unfollowUserController(req,res){

    const followerUsername = req.user.username;

    const followeeUsername = req.params.username;

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee : followeeUsername,
    })

    if(!isUserFollowing){
        return res.status(200).json({
            message : `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id);

    res.status(200).json({
        message : `You have unfollowed ${followeeUsername}`
    })
}

async function acceptFollowRequest(req,res) {

    const currentUser = req.user.username;
    const followerUsername = req.params.username;

    const request = await followModel.findOneAndUpdate(
        {
            follower : followerUsername,
            followee : currentUser,
            status : "pending"
        },
        {
            status : "accepted"
        },
        {
            new : true
        }
    );

    if(!request)
    {
        return res.status(404).json({
            message : "Follow request not found"
        })
    }

    res.status(200).json({
        message : "Follow request accepted",
        request
    })
}

async function rejectFollowRequest(req,res)
{   
    const currentUser = req.user.username;
    const followerUsername = req.params.username;

    const request = await followModel.findOneAndDelete({
        follower : followerUsername,
        followee : currentUser,
        status : "pending"
    })

    if(!request)
    {
        return res.status(404).json({
            message : "Follow request not found"
        })
    }

    res.status(200).json({
        message : "Follow request rejected",
        request
    })
}


module.exports = {
    followController,
    unfollowUserController,
    acceptFollowRequest,
    rejectFollowRequest
};