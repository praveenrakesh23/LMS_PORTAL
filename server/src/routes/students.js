const express = require('express');
const { Course, Enrollment, Module } = require('../models');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get enrolled courses for the current student
router.get('/enrolled-courses', verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Course,
          include: [
            {
              model: Module,
              attributes: ['id']
            }
          ]
        }
      ]
    });

    const courses = enrollments.map(enrollment => ({
      id: enrollment.Course.id,
      title: enrollment.Course.title,
      subtitle: enrollment.Course.subtitle,
      description: enrollment.Course.description,
      instructor: enrollment.Course.instructor ? `${enrollment.Course.instructor.firstName} ${enrollment.Course.instructor.lastName}` : 'Unknown',
      progress: enrollment.progress,
      stats: {
        modules: enrollment.Course.Modules.length,
        rating: enrollment.Course.rating,
        ratingCount: enrollment.Course.ratingCount,
        level: enrollment.Course.level,
        levelDesc: enrollment.Course.levelDesc
      },
      imageUrl: enrollment.Course.imageUrl,
      status: enrollment.Course.status,
      isPublic: enrollment.Course.isPublic,
      lastUpdated: enrollment.Course.lastUpdated,
      studentsEnrolled: enrollment.Course.studentsEnrolled
    }));

    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 