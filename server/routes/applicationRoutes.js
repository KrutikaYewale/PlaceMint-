import express from 'express';
import { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, withdrawApplication } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/:jobId/apply', protect, authorize('student'), applyForJob);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('company', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('company', 'admin'), updateApplicationStatus);
router.put('/:id/withdraw', protect, authorize('student'), withdrawApplication);

export default router;
