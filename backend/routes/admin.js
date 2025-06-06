import express from 'express';
import { isAdmin } from '../middleware/isAdmin.js';
import { GetAllData,GetUsers,DeleteUser,GetAllPosts } from '../controllers/Dashboard.js';

const router = express.Router();

router.use(isAdmin);

router.get('/dashboard', GetAllData);
router.get('/users', GetUsers);
router.delete('/deleteUser/:id', DeleteUser);
router.get('/allposts', GetAllPosts);


export default router;