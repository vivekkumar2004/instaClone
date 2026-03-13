const userModel = require("../models/user.model");
const crypto = require("crypto");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");


async function registerController(req, res) {
  const { email, username, password, bio, profileImage } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      Message: "User already exists",
    });
  }

  // const hashPass = crypto.createHash("sha256").update(password).digest("hex");

  const hashPass = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hashPass,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    Message: "User Registerd successfully",
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function loginController(req, res) {
  {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    // const hash = crypto.createHash("sha256").update(password).digest("hex");

    const isValidPass = await bcrypt.compare(password, user.password)

    if (!isValidPass) {
      return res.status(404).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username : user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(200).json({
      message:"User login successfully",
        user : {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  }
}

module.exports = {
    registerController,
    loginController
}