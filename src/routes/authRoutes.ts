import { Router, Request, Response, NextFunction } from 'express';
import {
  syncUser,
  getCurrentUser,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  getAllUsers,
} from '../controllers/authController';
import { authMiddleware, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/sync
 * @desc    Sync Firebase user to MongoDB after login
 * @access  Public
 */
router.post('/sync', (req: Request, res: Response, next: NextFunction) => {
  syncUser(req, res, next).catch(next);
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
router.get('/me', authMiddleware, getCurrentUser);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users with pagination + search
 * @access  Admin / Manager
 */
router.get('/users', authMiddleware, requireAdmin, getAllUsers);

/**
 * @route   GET /api/auth/users/:id
 * @desc    Get a specific user by MongoDB _id
 * @access  Admin / Manager
 */
router.get('/users/:id', authMiddleware, requireAdmin, getUserById);

/**
 * @route   PATCH /api/auth/users/:id/role
 * @desc    Update user role (Admin/Manager/User)
 * @access  Admin only
 */
router.patch('/users/:id/role', authMiddleware, requireAdmin, updateUserRole);

/**
 * @route   PATCH /api/auth/users/:id/status
 * @desc    Toggle user active/suspended status
 * @access  Admin only
 */
router.patch('/users/:id/status', authMiddleware, requireAdmin, toggleUserStatus);

export default router;
