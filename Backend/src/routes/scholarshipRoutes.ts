import express from 'express';
import { getScholarships, addScholarship , applyToScholarship, getAdminApplications, updateApplicationStatus ,getMyApplications , deleteScholarship} from '../controllers/scholarshipController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getScholarships)  
  .post(protect , addScholarship); 

router.post('/apply', protect ,applyToScholarship);

router.get('/admin/applications', protect, getAdminApplications);
router.patch('/admin/update-status', protect, updateApplicationStatus);
router.get('/my-applications', protect, getMyApplications);
router.delete("/:id", protect, deleteScholarship);

export default router;