import mongoose from 'mongoose';

/**
 * Company Schema - Extended profile for company/recruiter users
 * Links to User model via userId reference
 */
const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Information Technology', 'Finance', 'Healthcare',
      'Manufacturing', 'Consulting', 'E-Commerce',
      'Education', 'Telecom', 'Automotive', 'Other'
    ]
  },
  website: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  employeeCount: {
    type: String,
    enum: ['1-50', '51-200', '201-500', '501-1000', '1000+', ''],
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
export default Company;
