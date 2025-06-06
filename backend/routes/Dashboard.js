import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  DeleteUser,
  GetAllData,
  GetUsers,
  GetAllPosts,
} from "../controllers/Dashboard.js";

const DashboardRoutes = express.Router();

DashboardRoutes.get("/", isAdmin, GetAllData);
DashboardRoutes.get("/users", isAdmin, GetUsers);
DashboardRoutes.get("/allposts", isAdmin, GetAllPosts);
DashboardRoutes.delete("/deleteUser/:id", isAdmin, DeleteUser);

export default DashboardRoutes;
