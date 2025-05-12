import express from 'express';
import {
  register,
  login,
  logout,
  updateProfile,
  getUserProfile,
  verifyToken,
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload, handleMulterError } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/signUp', register);
router.post('/login', login);
router.delete('/logout', logout);

router.put(
  '/update-profile',
  protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 },
  ]),
  handleMulterError,
  updateProfile
);

router.get('/get-user-profile', protect, getUserProfile);
router.get('/verify-token', protect, verifyToken);

export default router;
