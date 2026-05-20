import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';

const checkEligibility = (student, job) => {
  const reasons = [];
  const suggestions = [];
  const el = job.eligibility;

  if (el.branches?.length > 0 && !el.branches.includes(student.branch)) {
    reasons.push(`Required branches: ${el.branches.join(', ')}. Yours: ${student.branch}`);
  }
  if (el.minCGPA && student.cgpa < el.minCGPA) {
    reasons.push(`Min CGPA: ${el.minCGPA}. Yours: ${student.cgpa}`);
    suggestions.push(`Improve CGPA by ${(el.minCGPA - student.cgpa).toFixed(2)}`);
  }
  if (el.maxBacklogs !== undefined && student.backlogs > el.maxBacklogs) {
    reasons.push(`Max backlogs: ${el.maxBacklogs}. Yours: ${student.backlogs}`);
  }
  if (el.passingYear && student.passingYear !== el.passingYear) {
    reasons.push(`Required year: ${el.passingYear}. Yours: ${student.passingYear}`);
  }
  if (el.requiredSkills?.length > 0) {
    const lower = student.skills.map(s => s.toLowerCase());
    const missing = el.requiredSkills.filter(s => !lower.includes(s.toLowerCase()));
    if (missing.length) suggestions.push(`Learn: ${missing.join(', ')}`);
  }
  return { isEligible: reasons.length === 0, reasons, suggestions };
};

export const applyForJob = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Complete your profile first' });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const exists = await Application.findOne({ studentId: student._id, jobId: req.params.jobId });
    if (exists) return res.status(400).json({ success: false, message: 'Already applied' });

    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Deadline passed' });
    }

    const eligibility = checkEligibility(student, job);
    if (!eligibility.isEligible) {
      return res.status(400).json({ success: false, message: 'Not eligible', eligibility });
    }

    const app = await Application.create({
      studentId: student._id, jobId: req.params.jobId,
      userId: req.user._id, eligibilityCheck: eligibility
    });
    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicantCount: 1 } });

    res.status(201).json({ success: true, message: 'Applied successfully', data: app, eligibility });
  } catch (error) { next(error); }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Profile not found' });

    const apps = await Application.find({ studentId: student._id })
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'companyName industry logo location' } })
      .sort('-appliedAt');
    res.status(200).json({ success: true, data: apps });
  } catch (error) { next(error); }
};

export const getJobApplicants = async (req, res, next) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .populate({ path: 'studentId', select: 'branch cgpa skills passingYear resumeURL phone backlogs' })
      .populate({ path: 'userId', select: 'name email avatar' })
      .sort('-appliedAt');
    res.status(200).json({ success: true, data: apps, count: apps.length });
  } catch (error) { next(error); }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, feedback, interviewDate } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });

    app.status = status;
    if (feedback) app.feedback = feedback;
    if (interviewDate) app.interviewDate = interviewDate;
    await app.save();

    if (status === 'selected') {
      const job = await Job.findById(app.jobId).populate('companyId', 'companyName');
      await Student.findByIdAndUpdate(app.studentId, {
        isPlaced: true, placedAt: job?.companyId?.companyName || '', placedPackage: job?.package?.max || 0
      });
      await Job.findByIdAndUpdate(app.jobId, { $inc: { selectedCount: 1 } });
    }
    res.status(200).json({ success: true, message: `Application ${status}`, data: app });
  } catch (error) { next(error); }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, userId: req.user._id });
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });
    if (['selected', 'rejected'].includes(app.status)) {
      return res.status(400).json({ success: false, message: 'Cannot withdraw finalized application' });
    }
    app.status = 'withdrawn';
    await app.save();
    await Job.findByIdAndUpdate(app.jobId, { $inc: { applicantCount: -1 } });
    res.status(200).json({ success: true, message: 'Withdrawn', data: app });
  } catch (error) { next(error); }
};
