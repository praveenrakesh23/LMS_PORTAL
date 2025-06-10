const express = require('express');
const { Module, Course, Lesson, Assignment } = require('../models');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all modules for a course
router.get('/course/:courseId', verifyToken, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'student') {
      const isEnrolled = await course.hasStudent(req.user.id);
      if (!isEnrolled && !course.isPublic) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }
    } else if (req.user.role === 'instructor' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this course' });
    }

    const modules = await Module.findAll({
      where: { courseId: req.params.courseId },
      include: [
        { model: Lesson, as: 'lessons' },
        { model: Assignment, as: 'assignments' }
      ],
      order: [['order', 'ASC']]
    });

    res.json(modules);
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single module
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id, {
      include: [
        { model: Course },
        { model: Lesson, as: 'lessons' },
        { model: Assignment, as: 'assignments' }
      ]
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Check permissions
    if (req.user.role === 'student') {
      const isEnrolled = await module.Course.hasStudent(req.user.id);
      if (!isEnrolled && !module.Course.isPublic) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }
    } else if (req.user.role === 'instructor' && module.Course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this module' });
    }

    res.json(module);
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create module (instructor/admin only)
router.post('/', verifyToken, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findByPk(req.body.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if instructor owns the course
    if (req.user.role === 'instructor' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create modules for this course' });
    }

    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update module (instructor/admin only)
router.put('/:id', verifyToken, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id, {
      include: [{ model: Course }]
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Check if instructor owns the course
    if (req.user.role === 'instructor' && module.Course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this module' });
    }

    await module.update(req.body);
    res.json(module);
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete module (instructor/admin only)
router.delete('/:id', verifyToken, checkRole(['instructor', 'admin']), async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id, {
      include: [{ model: Course }]
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Check if instructor owns the course
    if (req.user.role === 'instructor' && module.Course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this module' });
    }

    await module.destroy();
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 