import express from 'express';
import upload from '../middleware/Multer.js';
import { Login, Logout, Register, Check, UpdateProfile } from '../controllers/Auth.js';
import { isLogin } from '../middleware/Auth.js';

const AuthRoutes = express.Router()

AuthRoutes.post('/register',upload.single('profile'),Register)
AuthRoutes.post('/login',Login);
AuthRoutes.post('/logout',Logout);
AuthRoutes.get('/check', isLogin, Check);
AuthRoutes.post('/updateprofile', isLogin, upload.single('profile'), UpdateProfile);

export default AuthRoutes