import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

const isAdmin = async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies.token || 
                     req.headers.authorization?.split(' ')[1];
        
        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // 3. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again."
                });
            }
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }

        // 4. Find user
        const user = await UserModel.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // 5. Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // 6. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const isLogin = async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies.token || 
                     req.headers.authorization?.split(' ')[1];
        
        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        // 3. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again."
                });
            }
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }

        // 4. Find user
        const user = await UserModel.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // 5. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export { isAdmin, isLogin };