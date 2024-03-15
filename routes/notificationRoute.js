const express = require('express');
const router = express.Router();
const NotificationService = require('../services/notificationService');

// Route to create a notification
router.post('/notifications', async (req, res) => {
    try {
        const { notificationData } = req.body;
        const notification = await NotificationService.createNotification(notificationData);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get notifications for a specific user
router.get('/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await NotificationService.getNotifications(userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update a notification
router.put('/notifications/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;
        const updatedData = req.body;
        const notification = await NotificationService.updateNotification(notificationId, updatedData);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a notification
router.delete('/notifications/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;
        const deletedNotification = await NotificationService.deleteNotification(notificationId);
        res.status(200).json(deletedNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to mark a notification as read
router.put('/notifications/mark-read/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await NotificationService.markNotificationAsRead(notificationId);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to mark all notifications as read for a specific user
router.put('/notifications/mark-all-read/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await NotificationService.markAllNotificationsAsRead(userId);
        res.status(200).json({ message: 'All notifications marked as read successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
