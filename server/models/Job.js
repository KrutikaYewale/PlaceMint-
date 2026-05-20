import mongoose from 'mongoose';

/**
 * Job Schema - Represents a placement drive / job posting
 * Posted by companies, managed by admin
 */
const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Internship', 'Part-Time', 'Contract'],
    default: 'Full-Time'
  },
  package: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  location: {
    type: String,
    default: 'On-site'
  },
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  // Eligibility criteria for smart eligibility engine
  eligibility: {
    branches: [{
      type: String,
      enum: [
        'Computer Science', 'Information Technology',
        'Electronics', 'Electrical', 'Mechanical',
        'Civil', 'Chemical', 'Biotechnology',
        'Data Science', 'AI & ML', 'Other'
      ]
    }],
    minCGPA: { type: Number, default: 0 },
    maxBacklogs: { type: Number, default: 0 },
    passingYear: { type: Number },
    requiredSkills: [{ type: String }],
    minTenthPercentage: { type: Number, default: 0 },
    minTwelfthPercentage: { type: Number, default: 0 }
  },
  // Bond details
  bondPeriod: {
    type: Number, // in months
    default: 0
  },
  openings: {
    type: Number,
    default: 1
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  driveDate: {
    type: Date
  },
  rounds: [{
    name: { type: String },
    description: { type: String },
    date: { type: Date }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  applicantCount: {
    type: Number,
    default: 0
  },
  selectedCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
