const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const passwordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const profileValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('studyGoals.targetScore')
    .optional()
    .isFloat({ min: 0, max: 9 })
    .withMessage('Target score must be between 0 and 9'),
  body('studyGoals.targetDate')
    .optional()
    .isISO8601()
    .withMessage('Target date must be a valid date'),
  body('studyGoals.focusAreas')
    .optional()
    .isArray()
    .withMessage('Focus areas must be an array'),
];

// Routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleAuth
);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', passwordValidation, validateRequest, authController.resetPassword);

// Protected routes (require authentication)
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, profileValidation, validateRequest, authController.updateProfile);
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    ...passwordValidation,
  ],
  validateRequest,
  authController.changePassword
);

module.exports = router; 