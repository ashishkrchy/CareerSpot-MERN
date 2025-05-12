import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from '../utils/cloudinary.js';

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
        success: false,
      });
    }
    if (user.role !== role) {
      return res.status(400).json({
        message: 'Invalid role',
        success: false,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid email or password',
        success: false,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: {
          bio: user?.profile?.bio || null,
          skills: user?.profile?.skills || [],
          profilePicture: user?.profile?.profilePicture || null,
          resume: user?.profile?.resume || null,
        },
      },
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0),
    });

    res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0),
    });

    res.status(200).json({
      message: 'Logout successful',
      success: true,
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.user._id;

    if (
      !fullname &&
      !email &&
      !phoneNumber &&
      !bio &&
      !skills &&
      !req.files?.resume &&
      !req.files?.profilePicture
    ) {
      return res.status(400).json({
        message: 'At least one field must be provided to update',
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (!user.profile) user.profile = {};

    if (bio) user.profile.bio = bio;
    if (skills) {
      user.profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => skill.trim());
    }

    if (req.files?.resume?.[0]) {
      try {
        if (user.profile.resumePublicId) {
          await deleteFromCloudinary(user.profile.resumePublicId, 'raw');
        }

        const result = await uploadToCloudinary(req.files.resume[0].path, {
          resource_type: 'raw',
          folder: 'resumes',
        });

        user.profile.resume = result.secure_url;
        user.profile.resumePublicId = result.public_id;
        user.profile.resumeOriginalName = req.files.resume[0].originalname;
      } catch (error) {
        console.error('Resume upload error:', error);
        return res.status(500).json({
          message: 'Failed to upload resume',
          success: false,
        });
      }
    }

    if (req.files?.profilePicture?.[0]) {
      try {
        if (user.profile.profilePicturePublicId) {
          await deleteFromCloudinary(user.profile.profilePicturePublicId);
        }

        const result = await uploadToCloudinary(
          req.files.profilePicture[0].path,
          {
            folder: 'profile_pictures',
          }
        );

        user.profile.profilePicture = result.secure_url;
        user.profile.profilePicturePublicId = result.public_id;
      } catch (error) {
        console.error('Profile picture upload error:', error);
        return res.status(500).json({
          message: 'Failed to upload profile picture',
          success: false,
        });
      }
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      message: error.message || 'Internal server error',
      success: false,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: 'User data fetched successfully',
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
