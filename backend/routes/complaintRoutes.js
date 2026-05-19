import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchByLocation,
  filterByCategory,
  getAnalytics,
  exportComplaintsCSV,
} from '../controllers/complaintController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  createComplaintValidation,
  updateComplaintValidation,
} from '../validators/complaintValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchByLocation);
router.get('/filter', filterByCategory);
router.get('/analytics', restrictTo('admin'), getAnalytics);
router.get('/export/csv', restrictTo('admin'), exportComplaintsCSV);

router
  .route('/')
  .get(getComplaints)
  .post(upload.single('attachment'), createComplaintValidation, validate, createComplaint);

router
  .route('/:id')
  .get(getComplaintById)
  .put(updateComplaintValidation, validate, updateComplaint)
  .delete(restrictTo('admin'), deleteComplaint);

export default router;
