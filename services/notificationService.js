//// service/notification.js

const Notification = require('../models/Notification');

class NotificationService {
  async createNotification(notificationData) {
    try {
      const notification = await Notification.create(notificationData);
      return notification;
    } catch (error) {
      throw new Error('Could not create notification');
    }
  }

  async getNotifications(userId) {
    try {
      const notifications = await Notification.find({ user: userId });
      return notifications;
    } catch (error) {
      throw new Error('Could not fetch notifications');
    }
  }

  async updateNotification(notificationId, updatedData) {
    try {
      const notification = await Notification.findByIdAndUpdate(notificationId, updatedData, { new: true });
      if (!notification) {
        throw new Error('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new Error('Could not update notification');
    }
  }

  async deleteNotification(notificationId) {
    try {
      const notification = await Notification.findByIdAndDelete(notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new Error('Could not delete notification');
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
      if (!notification) {
        throw new Error('Notification not found');
      }
      return notification;
    } catch (error) {
      throw new Error('Could not mark notification as read');
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      const result = await Notification.updateMany({ user: userId }, { isRead: true });
      return result;
    } catch (error) {
      throw new Error('Could not mark all notifications as read');
    }
  }
}

module.exports = new NotificationService();
