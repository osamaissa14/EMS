import express from 'express';
import UserController from '../controllers/userController.js';
import { isAuthenticated, authenticateJWT } from '../middleware/auth.js';
import { validateUserProfile } from '../middleware/validation.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

// User profile routes (session-based authentication)
router.get('/profile', isAuthenticated, UserController.getProfile);
router.put('/profile', isAuthenticated, validateUserProfile, UserController.updateProfile);
router.delete('/account', isAuthenticated, UserController.deleteAccount);

// JWT-based routes
router.get('/profile-jwt', authenticateJWT, UserController.getProfile);
router.put('/profile-jwt', authenticateJWT, validateUserProfile, UserController.updateProfile);
router.post('/get-current-user', authenticateJWT, UserController.getCurrentUser);

// Admin routes
router.get('/all', isAuthenticated, isAdmin, UserController.getUsers);

export default router;