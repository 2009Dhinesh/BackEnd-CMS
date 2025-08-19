const Complaint = require('../models/Complaint');  
require('dotenv').config();



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


module.exports = { userRegister , userLogin , userDetails , updateUserProfile , userComplaint};
