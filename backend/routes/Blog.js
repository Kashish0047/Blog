import express from "express";
import {
  Create,
  Delete,
  GetPost,
  Update,
  GetSinglePost,
} from "../controllers/Blog.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/Multer.js";

const BlogRoutes = express.Router();

// Public routes
BlogRoutes.get("/getpost", GetPost);
BlogRoutes.get("/getpost/:id", GetSinglePost);

// Admin routes
BlogRoutes.post("/create", isAdmin, upload.single("postImage"), Create);
BlogRoutes.delete("/posts/:id", isAdmin, Delete);
BlogRoutes.patch("/update/:id", isAdmin, upload.single("postImage"), Update);

export default BlogRoutes;
