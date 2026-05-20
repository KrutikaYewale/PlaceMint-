import mongoose from 'mongoose';

/**
 * Application Schema - Tracks student applications to jobs
 * Maintains status workflow: applied -> shortlisted -> interviewed -> selected/rejected
 */
const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interviewed', 'selected', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  // Eligibility check results stored for transparency
  eligibilityCheck: {
    isEligible: { type: Boolean, default: true },
    reasons: [{ type: String }],
    suggestions: [{ type: String }]
  },
  notes: {
    type: String,
    default: ''
  },
  interviewDate: {
    type: Date
  },
  feedback: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
