const Department = require("../models/Department");
const Programme = require('../models/Programme');
const User = require('../models/UserSchema');        // <-- Add this import
const Complaint = require('../models/Complaint'); // <-- Add this import
const Block = require('../models/Block'); 
const Role = require('../models/Roles');
const RoomNumber = require('../models/RoomNumber');


// DashBoard

const totalStudent = async (req, res) => {
  try {
    const studentRole = await Role.findOne({ name: 'Student' }).lean();
    const totalStudents = studentRole
      ? await User.countDocuments({ role: studentRole._id })
      : 0;

    const totalComplaints = await Complaint.countDocuments();
    const solvedComplaints = await Complaint.countDocuments({ status: 'Solved' });
    const pendingComplaints = totalComplaints - solvedComplaints;

    return res.status(200).json({
      studentsCount: totalStudents,
      totalComplaints,
      solvedComplaints,
      pendingComplaints
    });
  } catch (error) {
    console.error('Dashboard Summary Error:', error.message);
    return res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};



const complaintsSummary = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const solvedComplaints = await Complaint.countDocuments({ status: 'Solved' });
    const pendingComplaints = await Complaint.countDocuments({ status: { $ne: 'Solved' } });

    res.json({
      totalComplaints,
      solvedComplaints,
      pendingComplaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add Department
const addDepartment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
    }

    console.log("Incoming department payload:", req.body);

    const { departmentName, shortName } = req.body;

    if (!departmentName || !shortName) {
      return res.status(400).json({ message: "Department Name and Short Name are required" });
    }

    // Check duplicate (case-insensitive)
    const existingDept = await Department.findOne({
      departmentName: { $regex: new RegExp(`^${departmentName.trim()}$`, "i") },
      shortName: { $regex: new RegExp(`^${shortName.trim()}$`, "i") }
    });

    if (existingDept) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = new Department({
      departmentName: departmentName.trim(),
      shortName: shortName.trim(),
      createdBy: req.user._id
    });

    const savedDept = await department.save();

    res.status(201).json({
      message: "Department added successfully",
      department: savedDept
    });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      data: departments
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const filterDepartment = async (req, res) => {
  try {
    const departments = await Department.find({}, { name: 1 }).lean(); // only _id & name
    res.json({ success: true, data: departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch departments" });
  }
};


const deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}
// Update Department

const updateDepartment = async (req, res) => {
  try {
    const { departmentName, shortName } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { departmentName, shortName },
      { new: true }
    );
    if (!updatedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department updated successfully', data: updatedDepartment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}


const addProgramme = async (req, res) => {
  try {
    const { department, programme, programmeShortName } = req.body;

    if (!department || !programme || !programmeShortName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!department.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID format'
      });
    }

    // Check if the programme already exists for the department
    const existingProgramme = await Programme.findOne({
      department,
      programme: programme.trim()
    });

    if (existingProgramme) {
      return res.status(409).json({
        success: false,
        message: 'Programme already exists for this department'
      });
    }

    const newProgramme = new Programme({
      department,
      programme: programme.trim(),
      programmeShortName: programmeShortName.trim()
    });

    await newProgramme.save();

    res.status(201).json({
      success: true,
      message: 'Programme added successfully',
      data: newProgramme
    });

  } catch (err) {
    console.error('Error adding programme:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};





// GET all programmes (optionally filter by department)
const getProgrammes = async (req, res) => {
  try {
    const { departmentId } = req.query; // optional query param

    let filter = {};
    if (departmentId) {
      filter.department = departmentId; // only programmes of this department
    }

    const programmes = await Programme.find(filter)
      .populate("department", "departmentName") // populate department name
      .lean();

    res.status(200).json({
      success: true,
      data: programmes,
      message: "Programmes fetched successfully",
    });
  } catch (err) {
    console.error("Get Programmes Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch programmes",
    });
  }
};
// GET /admin/programmes?department=departmentId



const getProgrammesByDepartment = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ message: "Department ID is required" });
    }

    // Fetch all programmes for department including duplicates
    const programmes = await Programme.find({ department });

    res.status(200).json(programmes);
  } catch (error) {
    console.error('Error fetching programmes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const editProgramme = async (req, res) => {
  try {
    const updatedProgramme = await Programme.findByIdAndUpdate(
      req.params.id,
      {
        programme: req.body.programme,
        programmeShortName: req.body.programmeShortName,
      },
      { new: true }
    );

    if (!updatedProgramme) {
      return res.status(404).json({ message: "Programme not found" });
    }

    res.status(200).json({ message: "Programme updated successfully", updatedProgramme });
  } catch (err) {
    res.status(500).json({ message: "Error updating programme", error: err.message });
  }
}

const deleteProgramme = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if programme exists
    const programme = await Programme.findById(id);
    if (!programme) {
      return res.status(404).json({ success: false, message: "Programme not found" });
    }

    // Delete programme
    await Programme.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Programme deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting programme:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


// add block


const addBlock = async (req, res) => {
  try {
    const { department, programme, blockName } = req.body;

    if (!department || !programme || !blockName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Optionally, check for duplicates here like you did for programmes

    const newBlock = new Block({ department, programme, blockName });
    await newBlock.save();

    res.status(201).json({ success: true, message: 'Block added successfully', data: newBlock });
  } catch (error) {
    console.error('Error adding block:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


const getBlock =  async (req, res) => {
  const { department, programme } = req.query;

  if (!department || !programme) {
    return res.status(400).json({ message: 'Department and programme are required' });
  }

  try {
    // Fetch blocks filtered by department & programme from DB
    const blocks = await Block.find({ department, programme });
    res.json({ success: true, data: blocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching blocks' });
  }
}


// room number

// Add Room Number
const addRoomNumber = async (req, res) => {
  try {
    const { department, programme, block, roomNumber } = req.body;

    if (!department || !programme || !block || !roomNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Optional: Check duplicate room number in the same block
    const existingRoom = await RoomNumber.findOne({
      department,
      programme,
      block,
      roomNumber: roomNumber.trim(),
    });

    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: 'Room Number already exists in this block',
      });
    }

    const newRoomNumber = new RoomNumber({
      department,
      programme,
      block,
      roomNumber: roomNumber.trim(),
    });

    await newRoomNumber.save();

    return res.status(201).json({
      success: true,
      message: 'Room Number added successfully',
      data: newRoomNumber,
    });
  } catch (error) {
    console.error('Error adding room number:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getRoomNumbers = async (req, res) => {
  try {
    const { department, programme, block } = req.query;

    if (!department || !programme || !block) {
      return res.status(400).json({
        success: false,
        message: 'Department, Programme, and Block are required',
      });
    }

    const roomNumbers = await RoomNumber.find({
      department,
      programme,
      block,
    });

    return res.status(200).json({
      success: true,
      data: roomNumbers,
    });
  } catch (error) {
    console.error('Error fetching room numbers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// user Details

// controllers/userController.js


const getAllUsers = async (req, res) => {
  try {
    // Build query for optional department filter
    let query = {};
    if (req.query.department && req.query.department !== 'All') {
      query.department = req.query.department;  // filter by department ObjectId
    }

    const users = await User.find(query)
      .populate('role', 'name')        // only role name
      .populate('department', 'name')  // only department name
      .lean();

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }

    res.json({
      success: true,
      data: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        department: user.department?.name || 'N/A',
        role: user.role?.name || 'N/A'
      }))
    });
  } catch (err) {
    console.error('❌ getAllUsers Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};





module.exports = { 
  totalStudent, 
  complaintsSummary , 
  addDepartment, 
  getDepartments, 
  filterDepartment,
  deleteDepartment,
  updateDepartment,
  addProgramme , 
  getProgrammes,
  getProgrammesByDepartment , 
  editProgramme,
  deleteProgramme,
  addBlock,
  getBlock,
  getRoomNumbers,
  addRoomNumber,
  getAllUsers
};
