const { Course, User, Module, Enrollment } = require('../models');
const path = require('path');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isPublic: true, status: 'published' },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    // Process courses to ensure image URLs are absolute
    const processedCourses = courses.map(course => {
      const courseData = course.toJSON();
      if (courseData.imageUrl && !courseData.imageUrl.startsWith('http')) {
        courseData.imageUrl = `${process.env.API_URL || 'http://localhost:5000'}${courseData.imageUrl}`;
      }
      return courseData;
    });

    res.json(processedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Module,
          include: ['lessons', 'assignments']
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Process course to ensure image URL is absolute
    const courseData = course.toJSON();
    if (courseData.imageUrl && !courseData.imageUrl.startsWith('http')) {
      courseData.imageUrl = `${process.env.API_URL || 'http://localhost:5000'}${courseData.imageUrl}`;
    }

    res.json(courseData);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { title, subtitle, description, level, levelDesc } = req.body;
    
    // Handle file upload
    let imageUrl = null;
    if (req.file) {
      // Create URL for the uploaded image
      imageUrl = `/uploads/courses/${req.file.filename}`;
    }
    
    const course = await Course.create({
      title,
      subtitle,
      description,
      instructorId: req.user.id,
      level,
      levelDesc,
      imageUrl,
      status: 'draft',
      isPublic: false
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const { title, subtitle, description, level, levelDesc, status, isPublic } = req.body;
    
    // Handle file upload
    let imageUrl = course.imageUrl;
    if (req.file) {
      // Delete old image if exists
      if (course.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../', course.imageUrl);
        try {
          await fs.promises.unlink(oldImagePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      // Create URL for the new image
      imageUrl = `/uploads/courses/${req.file.filename}`;
    }
    
    await course.update({
      title,
      subtitle,
      description,
      level,
      levelDesc,
      imageUrl,
      status,
      isPublic
    });

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    // Delete course image if exists
    if (course.imageUrl) {
      const imagePath = path.join(__dirname, '../../', course.imageUrl);
      try {
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.error('Error deleting course image:', err);
      }
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get enrolled courses for a student
exports.getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Course,
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    const courses = enrollments.map(enrollment => {
      const courseData = enrollment.Course.toJSON();
      // Process image URL
      if (courseData.imageUrl && !courseData.imageUrl.startsWith('http')) {
        courseData.imageUrl = `${process.env.API_URL || 'http://localhost:5000'}${courseData.imageUrl}`;
      }
      return {
        ...courseData,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
        lastAccessed: enrollment.lastAccessed
      };
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 