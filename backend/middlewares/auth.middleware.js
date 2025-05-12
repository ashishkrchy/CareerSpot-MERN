import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: No token provided',
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: User no longer exists',
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(401).json({
      message: 'Unauthorized: Invalid or expired token',
      success: false,
    });
  }
};
