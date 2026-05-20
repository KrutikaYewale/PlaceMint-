import mongoose from 'mongoose';

/**
 * Student Schema - Extended profile for student users
 * Links to User model via userId reference
 */
const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rollNumber: {
    type: String,
    trim: true,
    default: ''
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: [
      'Computer Science', 'Information Technology', 
      'Electronics', 'Electrical', 'Mechanical', 
      'Civil', 'Chemical', 'Biotechnology',
      'Data Science', 'AI & ML', 'Other'
    ]
  },
  cgpa: {
    type: Number,
    required: [true, 'CGPA is required'],
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot exceed 10']
  },
  passingYear: {
    type: Number,
    required: [true, 'Passing year is required']
  },
  backlogs: {
    type: Number,
    default: 0,
    min: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  certifications: [{
    name: { type: String, trim: true },
    issuer: { type: String, trim: true },
    year: { type: Number }
  }],
  resumeURL: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  linkedIn: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    maxlength: [500, 'About cannot exceed 500 characters'],
    default: ''
  },
  tenthPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  twelfthPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  isPlaced: {
    type: Boolean,
    default: false
  },
  placedAt: {
    type: String,
    default: ''
  },
  placedPackage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
