const Role = require('../models/Roles');

// Create a new role
const createRole = async (req, res) => {
  try {
    const { name , description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    // Create and save new role
    const newRole = new Role({ name, description });
    await newRole.save();

    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error: error.message });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error: error.message });
  }
};

// Update role by ID
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.name = name;
    role.description = description || '';
    await role.save();

    res.status(200).json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete role by ID
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.deleteOne();

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { createRole, getRoles , deleteRole , updateRole};
