import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, ...profileData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      isVerified: role === 'admin' ? true : false
    });

    // Create role-specific profile
    if (role === 'student' || !role) {
      await Student.create({
        userId: user._id,
        branch: profileData.branch || 'Computer Science',
        cgpa: profileData.cgpa || 0,
        passingYear: profileData.passingYear || new Date().getFullYear(),
        skills: profileData.skills || [],
        phone: profileData.phone || ''
      });
    } else if (role === 'company') {
      await Company.create({
        userId: user._id,
        companyName: profileData.companyName || name,
        industry: profileData.industry || 'Information Technology',
        website: profileData.website || '',
        description: profileData.description || '',
        location: profileData.location || ''
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === 'company') {
      profile = await Company.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        },
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, ...profileData } = req.body;

    // Update base user fields
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }
    if (avatar) {
      await User.findByIdAndUpdate(req.user._id, { avatar });
    }

    // Update role-specific profile
    let profile = null;
    if (req.user.role === 'student') {
      profile = await Student.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    } else if (req.user.role === 'company') {
      profile = await Company.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    }

    const updatedUser = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          isVerified: updatedUser.isVerified
        },
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};
