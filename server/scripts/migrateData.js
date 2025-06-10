require('dotenv').config();
const { sequelize, User, Course, Module, Lesson, Assignment } = require('../src/models');

// Sample data structure from localStorage
const sampleData = {
  courses: [
    {
      id: '1',
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming',
      instructor: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      modules: [
        {
          id: '1',
          title: 'Getting Started',
          lessons: [
            {
              id: '1',
              title: 'What is Programming?',
              content: 'Programming is...'
            }
          ],
          assignments: [
            {
              id: '1',
              title: 'First Program',
              description: 'Write your first program'
            }
          ]
        }
      ]
    }
  ]
};

const migrateData = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Create instructor
      const instructor = await User.create({
        email: sampleData.courses[0].instructor.email,
        firstName: sampleData.courses[0].instructor.name.split(' ')[0],
        lastName: sampleData.courses[0].instructor.name.split(' ')[1],
        password: 'changeme123', // Default password
        role: 'instructor'
      }, { transaction });

      // Create course
      const course = await Course.create({
        title: sampleData.courses[0].title,
        description: sampleData.courses[0].description,
        instructorId: instructor.id,
        status: 'published',
        isPublic: true
      }, { transaction });

      // Create modules
      for (const moduleData of sampleData.courses[0].modules) {
        const module = await Module.create({
          title: moduleData.title,
          courseId: course.id,
          order: 1,
          isPublished: true
        }, { transaction });

        // Create lessons
        for (const lessonData of moduleData.lessons) {
          await Lesson.create({
            title: lessonData.title,
            content: lessonData.content,
            moduleId: module.id,
            order: 1
          }, { transaction });
        }

        // Create assignments
        for (const assignmentData of moduleData.assignments) {
          await Assignment.create({
            title: assignmentData.title,
            description: assignmentData.description,
            moduleId: module.id,
            order: 1
          }, { transaction });
        }
      }

      // Commit transaction
      await transaction.commit();
      console.log('Migration completed successfully!');

    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run migration
migrateData(); 