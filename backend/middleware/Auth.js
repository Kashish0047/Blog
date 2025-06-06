import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const isLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const user = await UserModel.findById(decoded.userId); // Changed from id to userId

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug log
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const user = await UserModel.findById(decoded.userId); // Changed from id to userId

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug log
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};
