import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
} from '../controllers/job.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', protect, createJob);
router.get('/get', getAllJobs);
router.get('/get/:id', getJobById);
router.get('/getAdminJobs', protect, getAdminJobs);

export default router;
