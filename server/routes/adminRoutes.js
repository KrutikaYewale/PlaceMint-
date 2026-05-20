import express from 'express';
import { getAllStudents, getAllCompanies, verifyUser, toggleUserActive, getAnalytics, deleteUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/students', getAllStudents);
router.get('/companies', getAllCompanies);
router.get('/analytics', getAnalytics);
router.put('/verify/:userId', verifyUser);
router.put('/toggle-active/:userId', toggleUserActive);
router.delete('/users/:userId', deleteUser);

export default router;
