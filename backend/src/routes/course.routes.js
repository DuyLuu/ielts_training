const express = require('express');
const router = express.Router();
// const { verifyToken } = require('../middleware/auth.middleware');
// const courseController = require('../controllers/course.controller');

// Get all courses
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all courses - endpoint to be implemented' });
});

// Get a single course by ID
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get course with ID: ${req.params.id} - endpoint to be implemented` });
});

// Create a new course
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create course - endpoint to be implemented' });
});

// Update a course
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update course with ID: ${req.params.id} - endpoint to be implemented` });
});

// Delete a course
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete course with ID: ${req.params.id} - endpoint to be implemented` });
});

module.exports = router; 