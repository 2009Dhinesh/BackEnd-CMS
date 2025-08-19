const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

// Authenticate token and attach full user (with role populated)
const userMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token.trim()) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Empty token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token: Missing user ID' });
    }

    // Populate role name directly here
    const user = await User.findById(userId).populate('role', 'name');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = user; // full user with populated role
    console.log('✅ Authenticated User:', {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role?.name
    });
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    const message = err.name === 'TokenExpiredError'
      ? 'Token expired. Please log in again.'
      : 'Invalid token';
    return res.status(401).json({ success: false, message });
  }
};

// Only allow SuperAdmin access
const verifySuperAdmin = (req, res, next) => {
  try {
    const roleName = String(req.user.role?.name || '').toLowerCase().trim();

    if (roleName !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Super Admin only',
      });
    }

    next();
  } catch (err) {
    console.error('Verify Super Admin Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { userMiddleware, verifySuperAdmin };
