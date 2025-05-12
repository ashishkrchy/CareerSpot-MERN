import express from 'express';
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} from '../controllers/application.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/apply/:id', protect, applyJob);
router.get('/get', protect, getAppliedJobs);
router.get('/:id/applicants', protect, getApplicants);
router.put('/status/:id/update', protect, updateStatus);

export default router;
