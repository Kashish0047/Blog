import PostModel from "../models/Blog.model.js";
import { CommentModel } from "../models/Comments.model.js";
import { UserModel } from "../models/user.model.js";

const AddComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.user._id; // Get userId from authenticated user

    const newComment = new CommentModel({
      postId,
      userId,
      comment,
    });

    await newComment.save();

    const existPost = await PostModel.findById(postId);

    if (!existPost) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    existPost.comment.push(newComment._id);
    await existPost.save();

    // Populate the user data for the new comment
    const populatedComment = await CommentModel.findById(
      newComment._id
    ).populate("userId", "FullName profile");

    return res.status(200).json({
      message: "Comment added successfully",
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const DeleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const { email } = req.user; // Get user email from auth middleware

    // Check if the user is the admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        message: "Only admin can delete comments",
        success: false,
      });
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    // Remove comment from post
    await PostModel.findByIdAndUpdate(comment.postId, {
      $pull: { comment: commentId },
    });

    // Delete the comment
    await CommentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export { AddComment, DeleteComment };
