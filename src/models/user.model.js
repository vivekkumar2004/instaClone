const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "User name already exists"],
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email is already exists"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/amcckfvgw8/male-profile-picture-placeholder-for-social-media-forum-dating-site-chat-operator-design-social-profile-template-default-avatar-icon-flat-style-free-vector.jpg",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
