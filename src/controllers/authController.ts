import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface SyncUserBody {
  uid: string;
  email: string;
  name?: string;
  profilePic?: string;
}

/**
 * @route   POST /api/auth/sync
 * @desc    Sync Firebase user to MongoDB after login (upsert)
 * @access  Public
 */
export const syncUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { uid, email, name, profilePic }: SyncUserBody = req.body;

    if (!uid || !email) {
      res.status(400).json({ success: false, error: 'Missing required fields: uid and email.' });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Invalid email format.' });
      return;
    }

    let user = await User.findOne({ uid });

    if (user) {
      user.email = email.toLowerCase();
      user.name = name || user.name;
      if (profilePic) user.profilePic = profilePic;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'User synced successfully.',
        data: (user as any).getPublicData(),
      });
    } else {
      const newUser = new User({
        uid,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        profilePic: profilePic || '',
        role: 'User',
        isActive: true,
      });
      await newUser.save();

      res.status(201).json({
        success: true,
        message: 'User created and synced successfully.',
        data: (newUser as any).getPublicData(),
      });
    }
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, error: 'User with this UID or email already exists.' });
    } else {
      next(error);
    }
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reqUser = (req as any).user;
    if (!reqUser) {
      res.status(401).json({ success: false, error: 'Not authenticated.' });
      return;
    }

    const user = await User.findOne({ uid: reqUser.uid });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: (user as any).getPublicData(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/users
 * @desc    Get all users with pagination and search
 * @access  Admin / Manager
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query['limit'] as string) || 10));
    const search = (req.query['search'] as string)?.trim();

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users.map((u) => (u as any).getPublicData()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/users/:id
 * @desc    Get a single user by MongoDB _id
 * @access  Admin / Manager
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params['id']).select('-__v');
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.status(200).json({ success: true, data: (user as any).getPublicData() });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/auth/users/:id/role
 * @desc    Update user role
 * @access  Admin only
 */
export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body;
    const validRoles = ['Admin', 'Manager', 'User'];

    if (!validRoles.includes(role)) {
      res.status(400).json({ success: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params['id'],
      { role },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully.',
      data: (user as any).getPublicData(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/auth/users/:id/status
 * @desc    Toggle user active/suspended status
 * @access  Admin only
 */
export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params['id']);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isActive ? 'User reactivated successfully.' : 'User suspended successfully.',
      data: (user as any).getPublicData(),
    });
  } catch (error) {
    next(error);
  }
};
