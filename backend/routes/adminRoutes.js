import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUserById).delete(deleteUser);
router.patch('/users/:id/role', updateUserRole);

export default router;
