import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

/** @desc Get all students @route GET /api/admin/students */
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate('userId', 'name email isVerified isActive createdAt');
    res.status(200).json({ success: true, data: students });
  } catch (error) { next(error); }
};

/** @desc Get all companies @route GET /api/admin/companies */
export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('userId', 'name email isVerified isActive createdAt');
    res.status(200).json({ success: true, data: companies });
  } catch (error) { next(error); }
};

/** @desc Verify a user @route PUT /api/admin/verify/:userId */
export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'company') {
      await Company.findOneAndUpdate({ userId: user._id }, { isApproved: true });
    }
    res.status(200).json({ success: true, message: 'User verified', data: user });
  } catch (error) { next(error); }
};

/** @desc Toggle user active status @route PUT /api/admin/toggle-active/:userId */
export const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) { next(error); }
};

/** @desc Get analytics/dashboard stats @route GET /api/admin/analytics */
export const getAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const placedStudents = await Student.countDocuments({ isPlaced: true });
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const pendingJobs = await Job.countDocuments({ status: 'pending' });

    // Branch-wise placement
    const branchWise = await Student.aggregate([
      { $group: { _id: '$branch', total: { $sum: 1 }, placed: { $sum: { $cond: ['$isPlaced', 1, 0] } } } },
      { $sort: { total: -1 } }
    ]);

    // Package stats
    const packageStats = await Student.aggregate([
      { $match: { isPlaced: true, placedPackage: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$placedPackage' }, max: { $max: '$placedPackage' }, min: { $min: '$placedPackage' } } }
    ]);

    // Company-wise hiring
    const companyWise = await Student.aggregate([
      { $match: { isPlaced: true, placedAt: { $ne: '' } } },
      { $group: { _id: '$placedAt', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly applications trend
    const monthlyTrend = await Application.aggregate([
      { $group: { _id: { $month: '$appliedAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    // Application status distribution
    const statusDist = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: { totalStudents, totalCompanies, totalJobs, totalApplications, placedStudents, activeJobs, pendingJobs },
        placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0,
        branchWise,
        packageStats: packageStats[0] || { avg: 0, max: 0, min: 0 },
        companyWise,
        monthlyTrend,
        statusDistribution: statusDist
      }
    });
  } catch (error) { next(error); }
};

/** @desc Delete a user @route DELETE /api/admin/users/:userId */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        await Application.deleteMany({ studentId: student._id });
        await Student.findByIdAndDelete(student._id);
      }
    } else if (user.role === 'company') {
      const company = await Company.findOne({ userId: user._id });
      if (company) {
        const jobs = await Job.find({ companyId: company._id });
        for (const job of jobs) { await Application.deleteMany({ jobId: job._id }); }
        await Job.deleteMany({ companyId: company._id });
        await Company.findByIdAndDelete(company._id);
      }
    }
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};
