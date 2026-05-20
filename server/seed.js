import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Inline schemas to avoid import issues
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['student', 'company', 'admin'] },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rollNumber: String, branch: String, cgpa: Number, passingYear: Number,
  backlogs: { type: Number, default: 0 },
  skills: [String], certifications: [{ name: String, issuer: String, year: Number }],
  resumeURL: String, phone: String, linkedIn: String, github: String, about: String,
  tenthPercentage: Number, twelfthPercentage: Number,
  isPlaced: { type: Boolean, default: false }, placedAt: String, placedPackage: Number
}, { timestamps: true });

const companySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: String, industry: String, website: String, description: String,
  logo: String, location: String, employeeCount: String,
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  title: String, description: String, role: String,
  jobType: { type: String, default: 'Full-Time' },
  package: { min: Number, max: Number },
  location: String, workMode: { type: String, default: 'On-site' },
  eligibility: {
    branches: [String], minCGPA: Number, maxBacklogs: Number,
    passingYear: Number, requiredSkills: [String],
    minTenthPercentage: Number, minTwelfthPercentage: Number
  },
  bondPeriod: Number, openings: Number, deadline: Date, driveDate: Date,
  status: { type: String, default: 'active' },
  isApproved: { type: Boolean, default: true },
  applicantCount: { type: Number, default: 0 },
  selectedCount: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Company = mongoose.model('Company', companySchema);
const Job = mongoose.model('Job', jobSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create Admin
    const admin = await User.create({
      name: 'Admin User', email: 'admin@placemint.com', password: hashedPassword,
      role: 'admin', isVerified: true
    });
    console.log('Admin created: admin@placemint.com / password123');

    // Create Students
    const studentUsers = await User.insertMany([
      { name: 'Aarav Sharma', email: 'aarav@student.com', password: hashedPassword, role: 'student', isVerified: true },
      { name: 'Priya Patel', email: 'priya@student.com', password: hashedPassword, role: 'student', isVerified: true },
      { name: 'Rohan Mehta', email: 'rohan@student.com', password: hashedPassword, role: 'student', isVerified: true },
      { name: 'Sneha Kulkarni', email: 'sneha@student.com', password: hashedPassword, role: 'student', isVerified: true },
      { name: 'Arjun Reddy', email: 'arjun@student.com', password: hashedPassword, role: 'student', isVerified: true },
    ]);

    const students = await Student.insertMany([
      { userId: studentUsers[0]._id, branch: 'Computer Science', cgpa: 8.7, passingYear: 2026, skills: ['React','Node.js','Python','MongoDB'], phone: '9876543210', tenthPercentage: 92, twelfthPercentage: 88, about: 'Full-stack developer passionate about building scalable apps' },
      { userId: studentUsers[1]._id, branch: 'Information Technology', cgpa: 9.1, passingYear: 2026, skills: ['Java','Spring Boot','AWS','Docker'], phone: '9876543211', tenthPercentage: 95, twelfthPercentage: 91, about: 'Backend developer with cloud expertise' },
      { userId: studentUsers[2]._id, branch: 'Electronics', cgpa: 7.5, passingYear: 2026, skills: ['Embedded C','VLSI','IoT','Python'], phone: '9876543212', tenthPercentage: 85, twelfthPercentage: 82 },
      { userId: studentUsers[3]._id, branch: 'Data Science', cgpa: 9.3, passingYear: 2026, skills: ['Python','TensorFlow','SQL','Tableau'], phone: '9876543213', tenthPercentage: 96, twelfthPercentage: 93, isPlaced: true, placedAt: 'Google', placedPackage: 25 },
      { userId: studentUsers[4]._id, branch: 'Computer Science', cgpa: 8.2, passingYear: 2026, skills: ['JavaScript','React','Vue.js','Firebase'], phone: '9876543214', tenthPercentage: 88, twelfthPercentage: 85, isPlaced: true, placedAt: 'Microsoft', placedPackage: 18 },
    ]);
    console.log(`${students.length} students created`);

    // Create Companies
    const companyUsers = await User.insertMany([
      { name: 'HR Manager - TCS', email: 'hr@tcs.com', password: hashedPassword, role: 'company', isVerified: true },
      { name: 'Recruiter - Infosys', email: 'hr@infosys.com', password: hashedPassword, role: 'company', isVerified: true },
      { name: 'TA Lead - Google', email: 'ta@google.com', password: hashedPassword, role: 'company', isVerified: true },
    ]);

    const companies = await Company.insertMany([
      { userId: companyUsers[0]._id, companyName: 'Tata Consultancy Services', industry: 'Information Technology', location: 'Mumbai', website: 'https://tcs.com', description: 'Leading global IT services company', employeeCount: '1000+', isApproved: true },
      { userId: companyUsers[1]._id, companyName: 'Infosys Limited', industry: 'Information Technology', location: 'Bangalore', website: 'https://infosys.com', description: 'Digital services and consulting leader', employeeCount: '1000+', isApproved: true },
      { userId: companyUsers[2]._id, companyName: 'Google India', industry: 'Information Technology', location: 'Hyderabad', website: 'https://google.com', description: 'World leader in technology and innovation', employeeCount: '1000+', isApproved: true },
    ]);
    console.log(`${companies.length} companies created`);

    // Create Jobs
    const jobs = await Job.insertMany([
      {
        companyId: companies[0]._id, title: 'Software Developer', description: 'Build enterprise applications using Java and cloud technologies. Work with cross-functional teams on large-scale projects.',
        role: 'SDE', jobType: 'Full-Time', package: { min: 4, max: 7 }, location: 'Mumbai', workMode: 'Hybrid',
        eligibility: { branches: ['Computer Science','Information Technology'], minCGPA: 7.0, maxBacklogs: 0, passingYear: 2026, requiredSkills: ['Java','SQL'] },
        openings: 20, deadline: new Date('2026-07-30'), status: 'active', isApproved: true
      },
      {
        companyId: companies[1]._id, title: 'System Engineer', description: 'Join our flagship SE program. Work on cutting-edge projects across domains including BFSI, healthcare, and retail.',
        role: 'SE', jobType: 'Full-Time', package: { min: 3.6, max: 5 }, location: 'Pune', workMode: 'On-site',
        eligibility: { branches: ['Computer Science','Information Technology','Electronics','Electrical'], minCGPA: 6.5, maxBacklogs: 0, passingYear: 2026 },
        openings: 50, deadline: new Date('2026-08-15'), status: 'active', isApproved: true
      },
      {
        companyId: companies[2]._id, title: 'SDE Intern', description: 'Summer internship at Google. Work on products used by billions. Mentorship from senior engineers.',
        role: 'SDE Intern', jobType: 'Internship', package: { min: 12, max: 25 }, location: 'Hyderabad', workMode: 'On-site',
        eligibility: { branches: ['Computer Science','Data Science','AI & ML'], minCGPA: 8.5, maxBacklogs: 0, passingYear: 2026, requiredSkills: ['DSA','Python','System Design'] },
        openings: 5, deadline: new Date('2026-06-30'), status: 'active', isApproved: true
      },
      {
        companyId: companies[0]._id, title: 'Data Analyst', description: 'Analyze business data and create insights dashboards. Experience with Python and SQL required.',
        role: 'Analyst', jobType: 'Full-Time', package: { min: 5, max: 8 }, location: 'Chennai', workMode: 'Remote',
        eligibility: { branches: ['Computer Science','Data Science','Information Technology'], minCGPA: 7.5, maxBacklogs: 0, passingYear: 2026, requiredSkills: ['Python','SQL','Tableau'] },
        openings: 10, deadline: new Date('2026-07-15'), status: 'active', isApproved: true
      },
    ]);
    console.log(`${jobs.length} jobs created`);

    console.log('\n✅ Seed completed successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin:   admin@placemint.com / password123');
    console.log('  Student: aarav@student.com / password123');
    console.log('  Company: hr@tcs.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
