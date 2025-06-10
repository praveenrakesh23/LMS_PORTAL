const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes
router.use(verifyToken);

// Student routes
router.get('/enrolled', checkRole(['student']), courseController.getEnrolledCourses);

// Instructor/Admin routes
router.post('/', checkRole(['instructor', 'admin']), upload.single('image'), courseController.createCourse);
router.put('/:id', checkRole(['instructor', 'admin']), upload.single('image'), courseController.updateCourse);
router.delete('/:id', checkRole(['instructor', 'admin']), courseController.deleteCourse);

module.exports = router; 