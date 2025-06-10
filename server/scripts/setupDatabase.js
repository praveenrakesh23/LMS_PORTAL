require('dotenv').config();
const { sequelize, User, Course } = require('../src/models');

const setupDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database tables created.');

    // Create users
    const { Module, Lesson, Assignment, Quiz, QuizQuestion, Enrollment, Announcement, Grade } = require('../src/models');
    
    // Create admin user
    await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    console.log('Admin user created.');

    // Create student user
    const student = await User.create({
      email: 'student@example.com',
      password: 'student123',
      firstName: 'John',
      lastName: 'Student',
      role: 'student'
    });
    console.log('Student user created.');

    // Create instructor user
    const instructor = await User.create({
      email: 'john@example.com',
      password: 'changeme123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'instructor'
    });
    console.log('Instructor user created.');

    console.log('About to create courses...');
    // Create courses
    const courses = await Promise.all([
      Course.create({
        title: 'Advanced Digital Marketing',
        subtitle: "Get on the fast track to a career in digital marketing. In this certificate program, you'll learn in-demand skills, and get AI training from Google experts.",
        description: "Learn anytime, anywhere at your own pace with flexible modules tailored to fit your lifestyle. Upon completion, you'll be job-ready to step into entry-level roles.",
        instructorId: instructor.id,
        rating: 4.8,
        ratingCount: 33569,
        level: 'Beginner level',
        levelDesc: 'Recommended experience',
        studentsEnrolled: 15000,
        lastUpdated: new Date(),
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        status: 'published',
        isPublic: true,
        skills: [
          'Target Audience',
          'Email marketing',
          'social media strategy',
          'digital marketing',
          'campaign',
          'search engine',
          'programs',
          'order fulfillment',
          'e-commerce'
        ],
        learningObjectives: [
          'Learn the fundamentals of digital marketing and e-commerce to gain the skills needed to land an entry-level job.',
          'Attract and engage customers through digital marketing channels like search and email.',
          'Measure marketing performance through analytics and present insights.',
          'Build e-commerce stores, analyze online performance, and grow customer loyalty.'
        ]
      }),
      Course.create({
        title: 'Web Development Bootcamp',
        subtitle: "Master modern web development with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, and Node.js from industry experts.",
        description: "Build real-world projects and get hands-on experience with the latest web technologies. Perfect for beginners and intermediate developers.",
        instructorId: instructor.id,
        rating: 4.9,
        ratingCount: 28750,
        level: 'Intermediate level',
        levelDesc: 'Basic programming knowledge recommended',
        studentsEnrolled: 12000,
        lastUpdated: new Date(),
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
        status: 'published',
        isPublic: true,
        skills: [
          'HTML',
          'CSS',
          'JavaScript',
          'React',
          'Node.js',
          'Express',
          'MongoDB',
          'Git',
          'Web Development'
        ],
        learningObjectives: [
          'Build responsive websites using HTML, CSS, and JavaScript',
          'Create dynamic web applications with React',
          'Develop server-side applications with Node.js and Express',
          'Work with databases and implement authentication'
        ]
      })
    ]);
    console.log('Courses created successfully.');

    console.log('About to create enrollments...');
    // Register student for both courses
    const enrollments = await Promise.all([
      Enrollment.create({
        userId: student.id,
        courseId: courses[0].id,
        status: 'active',
        progress: 15,
        enrolledAt: new Date(),
        lastAccessed: new Date()
      }),
      Enrollment.create({
        userId: student.id,
        courseId: courses[1].id,
        status: 'active',
        progress: 25,
        enrolledAt: new Date(),
        lastAccessed: new Date()
      })
    ]);
    console.log('Enrollments created successfully.');

    console.log('About to create modules...');
    // Create modules for first course
    const modules1 = await Promise.all([
      Module.create({
        courseId: courses[0].id,
        title: 'Module 1: Introduction to Social Media Marketing',
        order: 1,
        isPublished: true,
        publishedAt: new Date()
      }),
      Module.create({
        courseId: courses[0].id,
        title: 'Module 2: Content Strategy and Creation',
        order: 2,
        isPublished: true,
        publishedAt: new Date()
      })
    ]);

    // Create modules for second course
    const modules2 = await Promise.all([
      Module.create({
        courseId: courses[1].id,
        title: 'Module 1: HTML & CSS Fundamentals',
        order: 1,
        isPublished: true,
        publishedAt: new Date()
      }),
      Module.create({
        courseId: courses[1].id,
        title: 'Module 2: JavaScript Basics',
        order: 2,
        isPublished: true,
        publishedAt: new Date()
      })
    ]);
    console.log('Modules created successfully.');

    console.log('About to create lessons...');
    // Create lessons for first course
    const lessons1 = await Promise.all([
      Lesson.create({
        moduleId: modules1[0].id,
        title: 'Overview of Social Media Platforms',
        content: 'Introduction to major social media platforms and their unique features.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        order: 1
      }),
      Lesson.create({
        moduleId: modules1[0].id,
        title: 'Social Media Strategy Basics',
        content: 'Learn how to develop an effective social media strategy.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        order: 2
      })
    ]);

    // Create lessons for second course
    const lessons2 = await Promise.all([
      Lesson.create({
        moduleId: modules2[0].id,
        title: 'HTML Structure and Elements',
        content: 'Learn the basics of HTML structure and common elements.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        order: 1
      }),
      Lesson.create({
        moduleId: modules2[0].id,
        title: 'CSS Styling and Layout',
        content: 'Master CSS styling and layout techniques.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        order: 2
      })
    ]);
    console.log('Lessons created successfully.');

    console.log('About to create assignments...');
    // Create assignments for first course
    const assignments1 = await Promise.all([
      Assignment.create({
        moduleId: modules1[0].id,
        title: 'Social Media Audit Report',
        description: 'Analyze and report on a company\'s social media presence.',
        order: 1
      }),
      Assignment.create({
        moduleId: modules1[1].id,
        title: 'Content Calendar Creation',
        description: 'Create a month-long content calendar for a specific brand.',
        order: 1
      })
    ]);

    // Create assignments for second course
    const assignments2 = await Promise.all([
      Assignment.create({
        moduleId: modules2[0].id,
        title: 'HTML Portfolio Page',
        description: 'Create a portfolio page using HTML and CSS.',
        order: 1
      }),
      Assignment.create({
        moduleId: modules2[1].id,
        title: 'JavaScript Calculator',
        description: 'Build a simple calculator using JavaScript.',
        order: 1
      })
    ]);
    console.log('Assignments created successfully.');

    console.log('About to create quizzes...');
    // Create quizzes for first course
    const quiz1 = await Quiz.create({
      courseId: courses[0].id,
      moduleId: modules1[0].id,
      title: 'Social Media Platforms Quiz',
      description: 'Test your knowledge of different social media platforms.',
      duration: 30,
      totalPoints: 10,
      status: 'published'
    });

    // Create quiz questions for first course
    await Promise.all([
      QuizQuestion.create({
        quizId: quiz1.id,
        text: 'Which platform is best for B2B marketing?',
        points: 1,
        options: ['Instagram', 'LinkedIn', 'TikTok', 'Snapchat'],
        correctAnswer: 'LinkedIn'
      }),
      QuizQuestion.create({
        quizId: quiz1.id,
        text: 'What is the maximum length of a Twitter post?',
        points: 1,
        options: ['140 characters', '280 characters', '500 characters', '1000 characters'],
        correctAnswer: '280 characters'
      })
    ]);

    // Create quizzes for second course
    const quiz2 = await Quiz.create({
      courseId: courses[1].id,
      moduleId: modules2[0].id,
      title: 'HTML & CSS Quiz',
      description: 'Test your knowledge of HTML and CSS fundamentals.',
      duration: 30,
      totalPoints: 10,
      status: 'published'
    });

    // Create quiz questions for second course
    await Promise.all([
      QuizQuestion.create({
        quizId: quiz2.id,
        text: 'What does HTML stand for?',
        points: 1,
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Hyper Text Modern Language'],
        correctAnswer: 'Hyper Text Markup Language'
      }),
      QuizQuestion.create({
        quizId: quiz2.id,
        text: 'Which CSS property is used to change the text color?',
        points: 1,
        options: ['text-color', 'color', 'font-color', 'text-style'],
        correctAnswer: 'color'
      })
    ]);
    console.log('Quizzes and questions created successfully.');

    console.log('About to create announcements...');
    // Create announcements for both courses
    await Promise.all([
      Announcement.create({
        courseId: courses[0].id,
        createdById: instructor.id,
        title: 'Welcome to Digital Marketing!',
        content: 'Welcome to Advanced Digital Marketing! We\'re excited to have you here.',
        createdAt: new Date()
      }),
      Announcement.create({
        courseId: courses[1].id,
        createdById: instructor.id,
        title: 'Welcome to Web Development!',
        content: 'Welcome to Web Development Bootcamp! Let\'s start building amazing websites together.',
        createdAt: new Date()
      })
    ]);
    console.log('Announcements created successfully.');

    console.log('About to create grades...');
    // Create some grades for the student
    await Promise.all([
      Grade.create({
        userId: student.id,
        courseId: courses[0].id,
        assignmentId: assignments1[0].id,
        score: 8,
        maxScore: 10,
        grade: 'B',
        feedback: 'Good work on the social media audit!',
        type: 'assignment'
      }),
      Grade.create({
        userId: student.id,
        courseId: courses[1].id,
        assignmentId: assignments2[0].id,
        score: 9,
        maxScore: 10,
        grade: 'A',
        feedback: 'Excellent portfolio page!',
        type: 'assignment'
      })
    ]);
    console.log('Grades created successfully.');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run setup
setupDatabase(); 