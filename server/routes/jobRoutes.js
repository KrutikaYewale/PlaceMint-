import express from 'express';
import { createJob, getJobs, getJob, updateJob, deleteJob, getMyJobs, approveJob } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getJobs);
router.get('/my-jobs', protect, authorize('company'), getMyJobs);
router.get('/:id', protect, getJob);
router.post('/', protect, authorize('company'), createJob);
router.put('/:id', protect, authorize('company', 'admin'), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);
router.put('/:id/approve', protect, authorize('admin'), approveJob);

export default router;
