import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const Register = async (req, res) => {
  try {
    const { FullName, email, password } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (existUser) {
      return res.status(300).json({
        message: "user already exists please login",
        success: false,
      });
    }

    const imagePath = req.file ? req.file.filename : null;

    const NewUser = new UserModel({
      FullName,
      email,
      password,
      profile: imagePath,
    });

    await NewUser.save();
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: NewUser,
    });
  } catch (error) {
    console.log("not register", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

// controllers/Auth.js
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    console.log("Found user:", user.email);
    console.log("Stored hashed password:", user.password);

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Check if this is the admin email
    const isAdmin = email === process.env.ADMIN_EMAIL;

    // If it's the admin email but role isn't set, update it
    if (isAdmin && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
    });

    // Don't send password back
    const userData = user.toObject();
    delete userData.password;

    console.log("Login response user data:", userData); // Debug log

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        ...userData,
        role: isAdmin ? "admin" : "user", // Make sure role is set correctly
      },
      token, // Send token in response body as well
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      // Changed status code to 200
      message: "Logout successfully",
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

const Check = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Authentication successful",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const UpdateProfile = async (req, res) => {
  console.log("[UpdateProfile] Request received. Body:", req.body);
  console.log("[UpdateProfile] Request file:", req.file);
  try {
    const { FullName, oldPassword, newPassword } = req.body;
    const userId = req.user?._id; // Added optional chaining for safety

    if (!userId) {
      console.error("[UpdateProfile] Error: User ID not found in req.user.");
      return res
        .status(401)
        .json({
          message: "Authentication error: User ID missing.",
          success: false,
        });
    }
    console.log(
      `[UpdateProfile] Attempting to update profile for userId: ${userId}`
    );

    const user = await UserModel.findById(userId);
    if (!user) {
      console.error(`[UpdateProfile] Error: User not found with ID: ${userId}`);
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (FullName) {
      user.FullName = FullName;
      console.log(`[UpdateProfile] FullName updated to: ${FullName}`);
    }

    if (oldPassword) {
      console.log("[UpdateProfile] Old password provided. Verifying...");
      const isMatch = await user.comparePassword(oldPassword);
      console.log(`[UpdateProfile] Old password match result: ${isMatch}`);
      if (!isMatch) {
        console.warn(
          `[UpdateProfile] Old password incorrect for userId: ${userId}`
        );
        return res
          .status(400)
          .json({ message: "Old password is incorrect", success: false });
      }
      if (newPassword) {
        user.password = newPassword; // Pre-save hook in model will hash it
        console.log(
          "[UpdateProfile] New password set (will be hashed on save)."
        );
      } else {
        console.warn(
          "[UpdateProfile] Old password provided, but no new password."
        );
        // Depending on desired behavior, you might want to return an error or just proceed without password change
      }
    } else if (newPassword) {
      console.warn(
        "[UpdateProfile] New password provided without old password."
      );
      return res.status(400).json({
        message: "Please provide your old password to update to a new password",
        success: false,
      });
    }

    if (req.file) {
      console.log(
        `[UpdateProfile] New profile image received: ${req.file.filename}`
      );
      if (user.profile) {
        const oldImagePath = path.join(
          process.cwd(),
          "public/images",
          user.profile
        );
        // IMPORTANT: Verify this path matches your Multer config and actual image storage location.
        // If your Multer saves to a different root (e.g. just 'public/images' relative to project root, not cwd() + 'uploads'), adjust this.
        console.log(
          `[UpdateProfile] Attempting to delete old profile image: ${oldImagePath}`
        );
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log(
              `[UpdateProfile] Successfully deleted old profile image: ${user.profile}`
            );
          } catch (unlinkError) {
            console.error(
              `[UpdateProfile] Error deleting old profile image ${user.profile}:`,
              unlinkError
            );
            // Decide if this should be a critical error or just a warning
          }
        } else {
          console.log(
            `[UpdateProfile] Old profile image not found at: ${oldImagePath}`
          );
        }
      }
      user.profile = req.file.filename;
    }

    console.log("[UpdateProfile] Attempting to save updated user data...");
    await user.save();
    console.log(
      `[UpdateProfile] User data saved successfully for userId: ${userId}`
    );

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error(
      "[UpdateProfile] Critical error during profile update:",
      error
    );
    // Check for Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        message: "Validation Error: " + messages.join(", "),
        success: false,
        errors: error.errors,
      });
    }
    return res.status(500).json({
      message: "Internal server error during profile update.",
      success: false,
      errorDetails: error.message,
    });
  }
};

export { Register, Login, Logout, Check, UpdateProfile };
