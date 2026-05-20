import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';

/**
 * @desc    Create a new job drive
 * @route   POST /api/jobs
 * @access  Private (Company)
 */
export const createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found. Please complete your profile first.'
      });
    }

    const jobData = {
      ...req.body,
      companyId: company._id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job drive created successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs with filtering & pagination
 * @route   GET /api/jobs
 * @access  Public
 */
export const getJobs = async (req, res, next) => {
  try {
    const {
      status, branch, jobType, workMode,
      minPackage, maxPackage, search,
      page = 1, limit = 10, sort = '-createdAt'
    } = req.query;

    const filter = {};

    // Only show approved/active jobs to non-admin users
    if (req.user?.role !== 'admin') {
      filter.status = { $in: ['approved', 'active'] };
      filter.isApproved = true;
    } else if (status) {
      filter.status = status;
    }

    if (branch) {
      filter['eligibility.branches'] = { $in: [branch] };
    }
    if (jobType) filter.jobType = jobType;
    if (workMode) filter.workMode = workMode;
    if (minPackage) filter['package.min'] = { $gte: Number(minPackage) };
    if (maxPackage) filter['package.max'] = { $lte: Number(maxPackage) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate('companyId', 'companyName industry logo location')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'companyName industry logo location website description');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a job
 * @route   PUT /api/jobs/:id
 * @access  Private (Company owner or Admin)
 */
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership (company can only edit their own jobs)
    if (req.user.role === 'company') {
      const company = await Company.findOne({ userId: req.user._id });
      if (!company || job.companyId.toString() !== company._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this job'
        });
      }
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 * @access  Private (Admin)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also delete related applications
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get jobs posted by current company
 * @route   GET /api/jobs/my-jobs
 * @access  Private (Company)
 */
export const getMyJobs = async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const jobs = await Job.find({ companyId: company._id })
      .populate('companyId', 'companyName industry logo')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a job (Admin only)
 * @route   PUT /api/jobs/:id/approve
 * @access  Private (Admin)
 */
export const approveJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, status: 'active' },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job approved successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};
