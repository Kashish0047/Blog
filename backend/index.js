import express from "express";
import dotenv from "dotenv";
import DBCon from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import cookieParser from "cookie-parser";
import BlogRoutes from "./routes/Blog.js";
import DashboardRoutes from "./routes/Dashboard.js";
import CommentsRoutes from "./routes/Comments.js";
import PublicRoutes from "./routes/Public.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set up CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// MongoDB connection
DBCon();

// Middlewares
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

// Simple route for testing
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// API Routes
app.use("/auth", AuthRoutes);
app.use("/blog", BlogRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/comment", CommentsRoutes);
app.use("/public", PublicRoutes);
app.use("/admin", adminRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
