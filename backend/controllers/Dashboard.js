import PostModel from "../models/Blog.model.js";
import { UserModel } from "../models/user.model.js";
import { CommentModel } from "../models/Comments.model.js";
import fs from "fs";
import path from "path";

const GetAllData = async (req, res) => {
  try {
    const Users = await UserModel.find();
    const Posts = await PostModel.find();

    // Get only comments that have valid post references
    const Comments = await CommentModel.find().populate("postId");
    const validComments = Comments.filter((comment) => comment.postId !== null);

    if (!Users && !Posts) {
      return res.status(404).json({
        message: "Data Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      users: Users,
      posts: Posts,
      comments: validComments,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const GetUsers = async (req, res) => {
  try {
    const Users = await UserModel.find();

    if (!Users) {
      return res.status(404).json({
        message: "Data Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      Users,
      success: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const existUser = await UserModel.findById(userId);
    if (!existUser) {
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    if (existUser.role == "admin") {
      return res.status(400).json({
        message: "Sorry You Are Admin You Can't Delete Your Account",
        success: false,
      });
    }

    if (existUser.image) {
      const profilePath = path.join("/public/images", existUser.image);
      fs.promises
        .unlink(profilePath)
        .then(() => console.log("user image deleted"))
        .catch((error) => console.log(error));
    }

    const deleteUser = await UserModel.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User Deleted Successfully",
      success: false,
      user: deleteUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
const GetAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }); // Sort by newest first

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: "No posts found",
        success: false,
      });
    }

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export { GetAllData, GetUsers, DeleteUser, GetAllPosts };
