import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  deleteNotification ,
  clearAllNotifications
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';


const router = express.Router();
router.use(protect);

router.get('/', getNotifications);
router.put('/mark-as-read', markAsRead);
router.delete('/clear-all', clearAllNotifications);
router.delete('/:id', deleteNotification);

export default router;