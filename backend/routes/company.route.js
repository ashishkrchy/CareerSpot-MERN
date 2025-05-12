import express from 'express';
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from '../controllers/company.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

import { upload, handleMulterError } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/register', protect, registerCompany);
router.get('/get-companies', protect, getCompany);
router.get('/get-company/:id', protect, getCompanyById);
router.put(
  '/update-company/:id',
  protect,
  upload.fields([{ name: 'logo', maxCount: 1 }]),
  handleMulterError,
  updateCompany
);

export default router;
