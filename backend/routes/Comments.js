import express from "express";
import { AddComment, DeleteComment } from "../controllers/Comments.js";
import { isLogin, isAdmin } from "../middleware/Auth.js";

const CommentRoutes = express.Router();

CommentRoutes.post("/addcomment", isLogin, AddComment);
CommentRoutes.post("/deletecomment", isAdmin, DeleteComment);

export default CommentRoutes;
