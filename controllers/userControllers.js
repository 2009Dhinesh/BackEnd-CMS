const User = require('../models/UserSchema'); 
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const userRegister = async (req, res) => {
    try {
        const { name, phone, email, password , role, department , programme} = req.body;

        if (!name || !phone || !email || !password || !role || !department || !programme) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // salt the password
        const saltPassword = await bcrypt.hash(password , 10);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, phone, email,password:saltPassword ,  role, department, programme }); 
        await newUser.save();

        res.status(200).json({ message: "Register Successfully..." });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email })
      .select('+password')
      .populate('role')
      .populate('department')
      .populate('programme');

    if (!validUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, validUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    if (!validUser.role || !validUser.role.name) {
      return res.status(403).json({
        success: false,
        message: 'Unknown Role',
        details: 'Role is not recognized'
      });
    }

    const tokenPayload = {
      _id: validUser._id,
      name: validUser.name,
      email: validUser.email,
      phone: validUser.phone,
      role: validUser.role.name,
      department: validUser.department?.name,
      programme: validUser.programme?.name
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: tokenPayload
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};









const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check for a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const { name, email, phone, department } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, department },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }};

  // Complaint 

const userComplaint = async (req, res) => {
  try {
    const { title, description, block, room, type, image } = req.body;

    // Validate required fields
    if (!title || !description || !block || !room || !type) {
      return res.status(400).json({ message: 'All fields are required except image.' });
    }

    // Make sure user ID is available (from middleware)
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const complaintData = new Complaint({
      title,
      description,
      block,
      room,
      type,
      image,
      user: userId,
    });

    const savedComplaint = await complaintData.save();

    console.log('Complaint saved:', savedComplaint);

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: savedComplaint,
    });

  } catch (error) {
    console.error('Complaint submission failed:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// forget password

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`
    });

    res.json({ message: 'Reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset email', error });
  }
}


// rest password

const restPassword =   async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

    user.password = password; // Will be hashed automatically by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
}


module.exports = { userRegister , userLogin , updateUserProfile , userComplaint, forgetPassword, restPassword};
