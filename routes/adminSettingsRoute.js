const express = require('express');
const router = express.Router();
const {updateAdminSettings, getAllAdminSettings} = require('../controllers/adminSettingsController');

// Route to update admin settings
router.post('/admin', updateAdminSettings);
//get all settings
router.get('/admin/getall', getAllAdminSettings);

module.exports = router;
