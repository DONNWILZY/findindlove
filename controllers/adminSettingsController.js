const mongoose = require('mongoose');
const Models = require('../models');
const Users = Models.user;
const AdminSettings = Models.adminSettings;





// Controller function to create or update admin settings
const updateAdminSettings = async (req, res) => {
    const { field, value } = req.body;

    try {
        // Validate request parameters
        if (!field || !value) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Update admin settings
        await AdminSettings.createOrUpdateField(field, value);

        res.status(200).json({ message: `Admin settings field "${field}" updated successfully` });
    } catch (error) {
        console.error('Error updating admin settings:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllAdminSettings = async (req, res) => {
    try {
        // Find the admin settings document
        const adminSettings = await AdminSettings.findOne();

        if (!adminSettings) {
            return res.status(404).json({ error: 'Admin settings not found' });
        }

        res.status(200).json(adminSettings);
    } catch (error) {
        console.error('Error getting admin settings:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { updateAdminSettings, getAllAdminSettings };
