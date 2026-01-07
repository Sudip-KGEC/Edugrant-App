import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany(
      { recipientId: (req as any).user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
};


export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
};


export const clearAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const result = await Notification.deleteMany({ recipientId: userId });

    res.status(200).json({ 
      message: 'All notifications cleared', 
      count: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing notifications' });
  }
};