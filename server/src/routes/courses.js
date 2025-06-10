const express = require('express');
const { Course, Module, Enrollment, User, Lesson, Assignment, Quiz, Grade } = require('../models');
const { verifyToken, checkRole } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all courses with enrollment status for the current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Module,
          as: 'modules',
          attributes: ['id']
        }
      ]
    });

    // Get user's enrollments
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      attributes: ['courseId', 'progress', 'status']
    });

    // Map enrollments to courses
    const coursesWithEnrollment = courses.map(course => {
      const enrollment = enrollments.find(e => e.courseId === course.id);
      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
        progress: enrollment ? enrollment.progress : 0,
        stats: {
          modules: course.modules.length,
          rating: course.rating,
          ratingCount: course.ratingCount,
          level: course.level,
          levelDesc: course.levelDesc
        },
        imageUrl: course.imageUrl,
        status: course.status,
        isPublic: course.isPublic,
        lastUpdated: course.lastUpdated,
        studentsEnrolled: course.studentsEnrolled
      };
    });

    res.json(coursesWithEnrollment);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get course details with enrollment and progress information
router.get('/:id', verifyToken, async (req, res) => {
  try {
    console.log('Fetching course details for ID:', req.params.id);
    
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!course) {
      console.log('Course not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('Found course:', course.title);

    // Get user's enrollment
    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: course.id
      }
    });

    console.log('Enrollment status:', enrollment ? 'Enrolled' : 'Not enrolled');

    // Get modules count
    const modules = await Module.findAll({
      where: { courseId: course.id },
      attributes: ['id']
    });

    // Get lessons count
    const lessons = await Lesson.findAll({
      where: { '$Module.courseId$': course.id },
      include: [{
        model: Module,
        as: 'Module',
        attributes: []
      }],
      attributes: ['id', 'completed']
    });

    // Get assignments count
    const assignments = await Assignment.findAll({
      where: { '$Module.courseId$': course.id },
      include: [{
        model: Module,
        as: 'Module',
        attributes: []
      }],
      attributes: ['id']
    });

    // Get quizzes count
    const quizzes = await Quiz.findAll({
      where: { courseId: course.id },
      attributes: ['id']
    });

    // Get completed assignments
    const completedAssignments = await Grade.count({
      where: {
        courseId: course.id,
        userId: req.user.id,
        type: 'assignment',
        score: { [Op.gt]: 0 }
      }
    });

    // Get completed quizzes
    const completedQuizzes = await Grade.count({
      where: {
        courseId: course.id,
        userId: req.user.id,
        type: 'quiz',
        score: { [Op.gt]: 0 }
      }
    });

    const courseDetails = {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      progress: enrollment ? enrollment.progress : 0,
      stats: {
        modules: modules.length,
        rating: course.rating,
        ratingCount: course.ratingCount,
        level: course.level,
        levelDesc: course.levelDesc
      },
      completion: {
        modules: { completed: 0, total: modules.length },
        assignments: { completed: completedAssignments, total: assignments.length },
        videos: { completed: lessons.filter(l => l.completed).length, total: lessons.length },
        quizzes: { completed: completedQuizzes, total: quizzes.length }
      },
      skills: course.skills || [],
      learn: course.learningObjectives || [],
      instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
      imageUrl: course.imageUrl,
      status: course.status,
      isPublic: course.isPublic
    };

    console.log('Sending course details response');
    res.json(courseDetails);
  } catch (error) {
    console.error('Error in course details endpoint:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create course (instructor/admin only)
router.post('/', verifyToken, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructorId: req.user.role === 'instructor' ? req.user.id : req.body.instructorId
    };

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update course (instructor/admin only)
router.put('/:id', verifyToken, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if instructor owns the course
    if (req.user.role === 'instructor' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    await course.update(req.body);
    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete course (instructor/admin only)
router.delete('/:id', verifyToken, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if instructor owns the course
    if (req.user.role === 'instructor' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Enroll in a course
router.post('/:id/enroll', verifyToken, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: course.id
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId: course.id,
      status: 'active',
      progress: 0,
      enrolledAt: new Date(),
      lastAccessed: new Date()
    });

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 