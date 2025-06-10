const express = require('express');
const router = express.Router();
const { Course, Enrollment, User } = require('../models');
const { verifyToken } = require('../middleware/auth');

// Get enrolled courses for the authenticated student
router.get('/enrolled-courses', verifyToken, async (req, res) => {
  try {
    console.log('Fetching enrolled courses for user:', req.user.id);
    
    const enrollments = await Enrollment.findAll({
      where: {
        userId: req.user.id,
        status: 'active'
      },
      include: [
        {
          model: Course,
          attributes: [
            'id',
            'title',
            'subtitle',
            'description',
            'imageUrl',
            'rating',
            'ratingCount',
            'level',
            'studentsEnrolled',
            'lastUpdated'
          ],
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ]
    });

    console.log('Found enrollments:', enrollments.length);

    const enrolledCourses = enrollments.map(enrollment => ({
      ...enrollment.Course.toJSON(),
      progress: enrollment.progress,
      lastAccessed: enrollment.lastAccessed,
      enrolledAt: enrollment.enrolledAt,
      rating: enrollment.Course.rating || 0,
      ratingCount: enrollment.Course.ratingCount || 0,
      studentsEnrolled: enrollment.Course.studentsEnrolled || 0,
      lastUpdated: enrollment.Course.lastUpdated || new Date()
    }));

    console.log('Processed enrolled courses:', enrolledCourses.length);
    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch enrolled courses',
      error: error.message 
    });
  }
});

module.exports = router; 