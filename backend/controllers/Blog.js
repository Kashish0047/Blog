import PostModel from "../models/Blog.model.js";
import { CommentModel } from "../models/Comments.model.js";
import fs from "fs";
import path from "path";

const Create = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const imagePath = req.file.filename;
    console.log("[Create Post] req.user:", req.user); // Log req.user
    const userId = req.user?._id; // Safely access _id

    if (!userId) {
      console.error("[Create Post] User ID not found in req.user");
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const CreateBlog = new PostModel({
      title,
      desc,
      image: imagePath,
      author: userId, // Save the author's ID
    });

    await CreateBlog.save();
    console.log("[Create Post] Saved post object:", CreateBlog); // Log saved post object
    return res.status(200).json({
      message: "Post Created successfully",
      success: true,
      post: CreateBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const Delete = async (req, res) => {
  try {
    const postId = req.params.id;

    const FindPost = await PostModel.findById(postId);

    if (!FindPost) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }

    // Delete all comments associated with this post
    await CommentModel.deleteMany({ postId: postId });

    // Delete the post
    await PostModel.findByIdAndDelete(postId);

    if (FindPost.image) {
      const profilePath = path.join("public/images", FindPost.image);
      fs.promises
        .unlink(profilePath)
        .then(() => console.log("profile image deleted"))
        .catch((error) => console.log("error deleting post image", error));
    }

    return res.status(200).json({
      message: "Post and associated comments deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

const GetPost = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(6); // Limit to 6 most recent posts

    if (!posts) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

const Update = async (req, res) => {
  try {
    console.log("[Update Post] req.body:", req.body);
    console.log("[Update Post] req.file:", req.file);
    const { title, desc } = req.body;
    const PostId = req.params.id;

    const postUpdate = await PostModel.findById(PostId);

    if (!postUpdate) {
      console.log(
        `[Update Post] Post with ID: ${PostId} not found for update.`
      );
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (title) {
      postUpdate.title = title;
    }

    if (desc) {
      postUpdate.desc = desc;
    }

    if (req.file) {
      // If there was an old image, consider deleting it from the filesystem here
      // For now, just updating the image name
      postUpdate.image = req.file.filename;
    }

    console.log(
      "[Update Post] Post object BEFORE save:",
      JSON.stringify(postUpdate, null, 2)
    );
    await postUpdate.save();

    console.log("[Update Post] Post updated successfully:", postUpdate);
    return res.status(200).json({
      message: "post updated successfully",
      success: true,
      postUpdate,
    });
  } catch (error) {
    console.error("[Update Post] Error during post update:", error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
      errorDetails: error.message, // Include more error details if possible
    });
  }
};

const GetSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(`[GetSinglePost] Fetching post with ID: ${postId}`);

    const post = await PostModel.findById(postId)
      .populate({
        path: "author",
        select: "FullName profile",
      })
      .populate({
        path: "comment",
        populate: {
          path: "userId",
          select: "FullName profile",
        },
        options: { sort: { createdAt: -1 } },
      });

    console.log(
      "[GetSinglePost] Post object AFTER ALL populates:",
      JSON.stringify(post, null, 2)
    );
    console.log(
      "[GetSinglePost] Populated post.author:",
      post ? post.author : "Post not found or author not populated"
    ); // Log populated author

    if (!post) {
      console.log(`[GetSinglePost] Post with ID: ${postId} not found.`);
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Detailed logging of comments
    if (post.comment && post.comment.length > 0) {
      console.log("[GetSinglePost] Populated comments details:");
      post.comment.forEach((c, index) => {
        console.log(`  Comment ${index + 1}:`, JSON.stringify(c, null, 2));
        if (c.userId) {
          console.log(
            `    Comment ${index + 1} User:`,
            JSON.stringify(c.userId, null, 2)
          );
        } else {
          console.log(
            `    Comment ${index + 1} User: userId not populated or null`
          );
        }
      });
    } else {
      console.log(
        "[GetSinglePost] No comments found for this post or 'comment' field is empty/null."
      );
    }

    console.log("[GetSinglePost] Sending post to client.");
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("[GetSinglePost] Error fetching post:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // Send error message in response for debugging
    });
  }
};

export { Create, Delete, GetPost, Update, GetSinglePost };
