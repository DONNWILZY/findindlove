const Permission = require('../models/UserPermission');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');


const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if name and description are provided
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    // Create new permission
    const newPermission = new Permission({ name, description });
    await newPermission.save();

    // Respond with the created permission
    return res.status(201).json({
      message: 'Permission created successfully',
      permission: {
        _id: newPermission._id,
        name: newPermission.name,
        description: newPermission.description
      }
    });
  } catch (error) {
    // Check if the error is a duplicate key error
    if (error.code === 11000 && error.keyPattern.name === 1) {
      return res.status(400).json({ message: 'Permission with this name already exists' });
    }
    // If it's not a duplicate key error, handle it as a generic error
    console.error('Failed to create permission:', error);
    return res.status(500).json({ message: 'An error occurred while creating the permission' });
  }
};


const addPermissionsToUser = async (userId, permissionIds) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find permissions by their IDs
    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length !== permissionIds.length) {
      throw new Error('One or more permissions not found');
    }

    // Extract permission names and descriptions
    const addedPermissions = [];
    for (const permission of permissions) {
      // Check if the user already has the permission
      if (!user.permissions.includes(permission.name)) {
        user.permissions.push(permission.name);
        addedPermissions.push({ name: permission.name, description: permission.description });
      }
    }
    await user.save();

    return { success: true, message: 'Permissions added successfully', permissions: addedPermissions };
  } catch (error) {
    console.error('Failed to add permissions to user:', error);
    return { success: false, message: 'An error occurred while adding permissions to the user' };
  }
};







module.exports = {
  createPermission,
  addPermissionsToUser 
};
