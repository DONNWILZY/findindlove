// permissionRoutes.js

const express = require('express');
const router = express.Router();
const { createPermission, addPermissionsToUser  } = require('../controllers/permissionController');

// create permissions
router.post('/create', createPermission);
// route to add permissions to a user
router.post('/assign/:userId/', async (req, res) => {
    const { userId } = req.params;
    const { permissionIds } = req.body;
  
    try {
      const result = await addPermissionsToUser(userId, permissionIds);
      if (result.success) {
        if (result.permissions.length > 0) {
          return res.status(200).json({ success: true, message: 'Permissions added successfully', permissions: result.permissions });
        } else {
          return res.status(200).json({ success: true, message: 'Permissions already exist for the user', permissions: [] });
        }
      } else {
        return res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error adding permissions to user:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



module.exports = router;
