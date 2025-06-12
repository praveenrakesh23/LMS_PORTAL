const { sequelize, User, Course, Module, Lesson, Quiz, QuizQuestion } = require('./models');

const seedData = async () => {
  try {
    // Create instructor user if not exists
    const instructor = await User.findOrCreate({
      where: { email: 'instructor@example.com' },
      defaults: {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: 'instructor'
      }
    });

    // Create or update the Advanced Digital Marketing course
    const course = await Course.findOrCreate({
      where: { title: 'Advanced Digital Marketing' },
      defaults: {
        subtitle: 'Master the art of digital marketing with advanced strategies and tools',
        description: 'A comprehensive course covering all aspects of modern digital marketing, from strategy to execution.',
        instructorId: instructor[0].id,
        status: 'published',
        isPublic: true,
        level: 'Advanced',
        levelDesc: 'For experienced marketers looking to enhance their skills',
        skills: [
          'Digital Strategy',
          'SEO & SEM',
          'Social Media Marketing',
          'Content Marketing',
          'Analytics',
          'Email Marketing',
          'E-commerce Marketing',
          'AI in Marketing'
        ],
        learningObjectives: [
          'Develop comprehensive digital marketing strategies',
          'Master advanced SEO and SEM techniques',
          'Create effective social media campaigns',
          'Implement data-driven marketing decisions',
          'Build and optimize marketing funnels',
          'Utilize AI tools for marketing automation'
        ]
      }
    });

    // Module 1: Marketing Strategy & Planning
    const module1 = await Module.create({
      courseId: course[0].id,
      title: 'Marketing Strategy & Planning',
      description: 'Learn to create effective digital marketing strategies and plans',
      order: 1,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 1
    const module1Lessons = [
      {
        title: 'Understanding the Digital Marketing Funnel',
        content: 'Learn about the different stages of the digital marketing funnel and how to optimize each stage.',
        order: 1
      },
      {
        title: 'Customer Journey Mapping',
        content: 'Create detailed customer journey maps to understand and improve the user experience.',
        order: 2
      },
      {
        title: 'Creating a Digital Marketing Strategy',
        content: 'Develop comprehensive digital marketing strategies aligned with business goals.',
        order: 3
      },
      {
        title: 'Budgeting and KPI Planning',
        content: 'Learn to allocate resources effectively and set measurable KPIs.',
        order: 4
      },
      {
        title: 'Competitive Analysis (SWOT & Benchmarking)',
        content: 'Conduct thorough competitive analysis using SWOT and benchmarking techniques.',
        order: 5
      }
    ];

    await Promise.all(module1Lessons.map(lesson => 
      Lesson.create({
        ...lesson,
        moduleId: module1.id
      })
    ));

    // Add quiz for Module 1
    const module1Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module1.id,
      title: 'Marketing Strategy & Planning Quiz',
      description: 'Test your understanding of marketing strategy and planning concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 1 quiz
    const module1Questions = [
      {
        text: 'What is the main goal of a marketing funnel?',
        points: 1,
        options: [
          'Increase website speed',
          'Automate content',
          'Guide customers from awareness to conversion',
          'Reduce ad costs'
        ],
        correctAnswer: 'Guide customers from awareness to conversion'
      },
      {
        text: 'A SMART goal is:',
        points: 1,
        options: [
          'Specific, Measurable, Achievable, Relevant, Time-bound',
          'Strategic, Marketable, Accurate, Realistic, Timed',
          'Scalable, Measurable, Affordable, Reliable, Tested',
          'None of the above'
        ],
        correctAnswer: 'Specific, Measurable, Achievable, Relevant, Time-bound'
      },
      {
        text: 'What tool is typically used for competitor keyword analysis?',
        points: 1,
        options: [
          'Google Trends',
          'Google Calendar',
          'SEMrush',
          'Google Docs'
        ],
        correctAnswer: 'SEMrush'
      },
      {
        text: 'Which of the following is NOT a stage in the customer journey?',
        points: 1,
        options: [
          'Consideration',
          'Engagement',
          'Conversion',
          'Server-side rendering'
        ],
        correctAnswer: 'Server-side rendering'
      },
      {
        text: 'What is a KPI?',
        points: 1,
        options: [
          'Key Product Inventory',
          'Key Performance Indicator',
          'Keyword Placement Index',
          'Knowledge Planning Insight'
        ],
        correctAnswer: 'Key Performance Indicator'
      }
    ];

    await Promise.all(module1Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module1Quiz.id
      })
    ));

    // Module 2: Advanced SEO & SEM
    const module2 = await Module.create({
      courseId: course[0].id,
      title: 'Advanced SEO & SEM',
      description: 'Master advanced SEO techniques and search engine marketing',
      order: 2,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 2
    const module2Lessons = [
      {
        title: 'Technical SEO (Site Structure, Indexing, Page Speed)',
        content: 'Learn advanced technical SEO techniques to improve site performance.',
        order: 1
      },
      {
        title: 'Voice Search & AI-based SEO',
        content: 'Optimize for voice search and leverage AI for SEO improvements.',
        order: 2
      },
      {
        title: 'Schema Markup & Rich Snippets',
        content: 'Implement schema markup to enhance search results with rich snippets.',
        order: 3
      },
      {
        title: 'Advanced Keyword Research Tools (SEMRush, Ahrefs)',
        content: 'Master advanced keyword research using professional tools.',
        order: 4
      },
      {
        title: 'Google Ads Mastery – Search, Display & Shopping Campaigns',
        content: 'Create and optimize various types of Google Ads campaigns.',
        order: 5
      },
      {
        title: 'A/B Testing in Google Ads',
        content: 'Learn to conduct effective A/B tests for Google Ads campaigns.',
        order: 6
      }
    ];

    await Promise.all(module2Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module2.id
      })
    ));

    // Add quiz for Module 2
    const module2Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module2.id,
      title: 'Advanced SEO & SEM Quiz',
      description: 'Test your knowledge of advanced SEO and SEM concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 2 quiz
    const module2Questions = [
      {
        text: 'Canonical tags are used to:',
        points: 1,
        options: [
          'Increase crawl budget',
          'Identify duplicate content',
          'Improve page design',
          'Enhance backlinks'
        ],
        correctAnswer: 'Identify duplicate content'
      },
      {
        text: 'Which of these tools is best for backlink analysis?',
        points: 1,
        options: [
          'Canva',
          'Google Ads',
          'Ahrefs',
          'Buffer'
        ],
        correctAnswer: 'Ahrefs'
      },
      {
        text: 'Quality Score in Google Ads depends on:',
        points: 1,
        options: [
          'Ad color',
          'CTR, Ad Relevance, Landing Page',
          'Budget only',
          'Impressions'
        ],
        correctAnswer: 'CTR, Ad Relevance, Landing Page'
      },
      {
        text: 'What does PPC stand for?',
        points: 1,
        options: [
          'Paid Per Channel',
          'Pay Per Click',
          'Personal Product Campaign',
          'Price Per Customer'
        ],
        correctAnswer: 'Pay Per Click'
      },
      {
        text: 'What is schema markup?',
        points: 1,
        options: [
          'A new ad format',
          'A site speed technique',
          'Structured data for rich search results',
          'Meta description length'
        ],
        correctAnswer: 'Structured data for rich search results'
      }
    ];

    await Promise.all(module2Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module2Quiz.id
      })
    ));

    // Module 3: Performance Marketing & Analytics
    const module3 = await Module.create({
      courseId: course[0].id,
      title: 'Performance Marketing & Analytics',
      description: 'Learn to optimize marketing performance and analyze data effectively',
      order: 3,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 3
    const module3Lessons = [
      {
        title: 'Conversion Rate Optimization (CRO)',
        content: 'Learn techniques to improve conversion rates and optimize user experience.',
        order: 1
      },
      {
        title: 'Landing Page Optimization',
        content: 'Create high-converting landing pages that drive results.',
        order: 2
      },
      {
        title: 'Campaign Funnel Building',
        content: 'Design and implement effective marketing funnels.',
        order: 3
      },
      {
        title: 'Performance Marketing Metrics (CPA, ROAS, LTV)',
        content: 'Understand and track key performance metrics.',
        order: 4
      },
      {
        title: 'Heatmaps & Session Recording (Hotjar, CrazyEgg)',
        content: 'Use heatmaps and session recordings to understand user behavior.',
        order: 5
      },
      {
        title: 'Attribution Models & Funnel Tracking (Google Analytics 4, Mixpanel)',
        content: 'Implement and analyze attribution models for better insights.',
        order: 6
      }
    ];

    await Promise.all(module3Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module3.id
      })
    ));

    // Add quiz for Module 3
    const module3Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module3.id,
      title: 'Performance Marketing & Analytics Quiz',
      description: 'Test your knowledge of performance marketing and analytics concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 3 quiz
    const module3Questions = [
      {
        text: 'What does CRO stand for?',
        points: 1,
        options: [
          'Customer Revenue Optimization',
          'Conversion Rate Optimization',
          'Cost Reduction Operations',
          'Click Rate Objective'
        ],
        correctAnswer: 'Conversion Rate Optimization'
      },
      {
        text: 'Heatmaps show:',
        points: 1,
        options: [
          'Ads performance',
          'Visitor behavior on a webpage',
          'Server health',
          'Domain age'
        ],
        correctAnswer: 'Visitor behavior on a webpage'
      },
      {
        text: 'Which metric tells how much you spent to acquire one paying customer?',
        points: 1,
        options: [
          'ROAS',
          'CPA',
          'CTR',
          'CPM'
        ],
        correctAnswer: 'CPA'
      },
      {
        text: 'A high bounce rate generally indicates:',
        points: 1,
        options: [
          'Good user engagement',
          'Short loading time',
          'Visitors are leaving without interaction',
          'Strong brand loyalty'
        ],
        correctAnswer: 'Visitors are leaving without interaction'
      },
      {
        text: 'What is a funnel in analytics?',
        points: 1,
        options: [
          'A blog post strategy',
          'A tool for backlinks',
          'A step-by-step process leading to a goal',
          'A visual branding tool'
        ],
        correctAnswer: 'A step-by-step process leading to a goal'
      }
    ];

    await Promise.all(module3Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module3Quiz.id
      })
    ));

    // Module 4: Social Media Strategy
    const module4 = await Module.create({
      courseId: course[0].id,
      title: 'Social Media Strategy (Organic + Paid)',
      description: 'Master both organic and paid social media marketing',
      order: 4,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 4
    const module4Lessons = [
      {
        title: 'Platform-Specific Algorithms (Instagram, LinkedIn, TikTok, X)',
        content: 'Understand how different social media algorithms work.',
        order: 1
      },
      {
        title: 'Content Pillars & Planning',
        content: 'Create effective content strategies for social media.',
        order: 2
      },
      {
        title: 'Paid Campaigns (Meta Ads Manager, LinkedIn Ads)',
        content: 'Set up and optimize paid social media campaigns.',
        order: 3
      },
      {
        title: 'Influencer Marketing Strategy',
        content: 'Develop and execute influencer marketing campaigns.',
        order: 4
      },
      {
        title: 'Advanced Audience Segmentation and Retargeting',
        content: 'Create targeted campaigns using advanced segmentation.',
        order: 5
      }
    ];

    await Promise.all(module4Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module4.id
      })
    ));

    // Add quiz for Module 4
    const module4Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module4.id,
      title: 'Social Media Strategy Quiz',
      description: 'Test your knowledge of social media marketing concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 4 quiz
    const module4Questions = [
      {
        text: 'The algorithm of Instagram prioritizes:',
        points: 1,
        options: [
          'Follower count',
          'Ad frequency',
          'Engagement (likes, comments, shares)',
          'Post length'
        ],
        correctAnswer: 'Engagement (likes, comments, shares)'
      },
      {
        text: 'Which ad platform is best for B2B targeting?',
        points: 1,
        options: [
          'TikTok',
          'LinkedIn',
          'Snapchat',
          'Pinterest'
        ],
        correctAnswer: 'LinkedIn'
      },
      {
        text: 'Retargeting is used to:',
        points: 1,
        options: [
          'Send new traffic to your site',
          'Track server response',
          'Reach users who visited your site earlier',
          'Improve local SEO'
        ],
        correctAnswer: 'Reach users who visited your site earlier'
      },
      {
        text: 'UGC stands for:',
        points: 1,
        options: [
          'Unique Global Content',
          'User Generated Content',
          'Unused Google Campaign',
          'Universal Graphical Conversion'
        ],
        correctAnswer: 'User Generated Content'
      },
      {
        text: 'A "lookalike audience" is:',
        points: 1,
        options: [
          'Visitors who look like you',
          'A clone of competitors\' followers',
          'An audience similar to your existing customers',
          'None of the above'
        ],
        correctAnswer: 'An audience similar to your existing customers'
      }
    ];

    await Promise.all(module4Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module4Quiz.id
      })
    ));

    // Module 5: Content Marketing
    const module5 = await Module.create({
      courseId: course[0].id,
      title: 'Content Marketing',
      description: 'Master the art of creating and distributing valuable content',
      order: 5,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 5
    const module5Lessons = [
      {
        title: 'Content Strategy Development',
        content: 'Learn to create comprehensive content strategies aligned with business goals.',
        order: 1
      },
      {
        title: 'Content Calendar & Planning',
        content: 'Create and manage effective content calendars for consistent publishing.',
        order: 2
      },
      {
        title: 'SEO Content Writing',
        content: 'Write content that ranks well in search engines while engaging readers.',
        order: 3
      },
      {
        title: 'Content Distribution Channels',
        content: 'Identify and utilize the best channels for content distribution.',
        order: 4
      },
      {
        title: 'Content Performance Analytics',
        content: 'Measure and analyze content performance to optimize strategy.',
        order: 5
      }
    ];

    await Promise.all(module5Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module5.id
      })
    ));

    // Add quiz for Module 5
    const module5Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module5.id,
      title: 'Content Marketing Quiz',
      description: 'Test your knowledge of content marketing concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 5 quiz
    const module5Questions = [
      {
        text: 'What is the main goal of content marketing?',
        points: 1,
        options: [
          'To sell products directly',
          'To provide value and build trust',
          'To increase ad revenue',
          'To reduce marketing costs'
        ],
        correctAnswer: 'To provide value and build trust'
      },
      {
        text: 'Which is NOT a key element of a content strategy?',
        points: 1,
        options: [
          'Target audience definition',
          'Content calendar',
          'Direct sales pitch',
          'Distribution channels'
        ],
        correctAnswer: 'Direct sales pitch'
      },
      {
        text: 'What is pillar content?',
        points: 1,
        options: [
          'A type of social media post',
          'Comprehensive content that covers a topic in depth',
          'A paid advertisement',
          'A video tutorial'
        ],
        correctAnswer: 'Comprehensive content that covers a topic in depth'
      },
      {
        text: 'Which metric is most important for content engagement?',
        points: 1,
        options: [
          'Page views',
          'Time on page',
          'Bounce rate',
          'Social shares'
        ],
        correctAnswer: 'Time on page'
      },
      {
        text: 'What is content repurposing?',
        points: 1,
        options: [
          'Deleting old content',
          'Reusing content in different formats',
          'Copying competitor content',
          'Updating meta descriptions'
        ],
        correctAnswer: 'Reusing content in different formats'
      }
    ];

    await Promise.all(module5Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module5Quiz.id
      })
    ));

    // Module 6: Email Marketing
    const module6 = await Module.create({
      courseId: course[0].id,
      title: 'Email Marketing',
      description: 'Learn to create effective email marketing campaigns',
      order: 6,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 6
    const module6Lessons = [
      {
        title: 'Email List Building & Management',
        content: 'Learn strategies for growing and maintaining a quality email list.',
        order: 1
      },
      {
        title: 'Email Campaign Planning',
        content: 'Plan and structure effective email marketing campaigns.',
        order: 2
      },
      {
        title: 'Email Copywriting & Design',
        content: 'Create compelling email content and design that converts.',
        order: 3
      },
      {
        title: 'Email Automation & Workflows',
        content: 'Set up automated email sequences and workflows.',
        order: 4
      },
      {
        title: 'Email Analytics & Optimization',
        content: 'Analyze email performance and optimize campaigns.',
        order: 5
      }
    ];

    await Promise.all(module6Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module6.id
      })
    ));

    // Add quiz for Module 6
    const module6Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module6.id,
      title: 'Email Marketing Quiz',
      description: 'Test your knowledge of email marketing concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 6 quiz
    const module6Questions = [
      {
        text: 'What is a good email open rate?',
        points: 1,
        options: [
          '5-10%',
          '15-25%',
          '30-40%',
          '50% or higher'
        ],
        correctAnswer: '15-25%'
      },
      {
        text: 'Which is NOT a best practice for email subject lines?',
        points: 1,
        options: [
          'Using all caps',
          'Creating urgency',
          'Personalization',
          'A/B testing'
        ],
        correctAnswer: 'Using all caps'
      },
      {
        text: 'What is a welcome email sequence?',
        points: 1,
        options: [
          'A series of emails sent to new subscribers',
          'A customer service response',
          'A promotional campaign',
          'A newsletter template'
        ],
        correctAnswer: 'A series of emails sent to new subscribers'
      },
      {
        text: 'Which email metric indicates engagement?',
        points: 1,
        options: [
          'Open rate',
          'Click-through rate',
          'Bounce rate',
          'Delivery rate'
        ],
        correctAnswer: 'Click-through rate'
      },
      {
        text: 'What is email segmentation?',
        points: 1,
        options: [
          'Deleting inactive subscribers',
          'Dividing your list into smaller groups',
          'Sending the same email multiple times',
          'Combining multiple email lists'
        ],
        correctAnswer: 'Dividing your list into smaller groups'
      }
    ];

    await Promise.all(module6Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module6Quiz.id
      })
    ));

    // Module 7: E-commerce Marketing
    const module7 = await Module.create({
      courseId: course[0].id,
      title: 'E-commerce Marketing',
      description: 'Master marketing strategies for online stores',
      order: 7,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 7
    const module7Lessons = [
      {
        title: 'E-commerce Marketing Strategy',
        content: 'Develop comprehensive marketing strategies for online stores.',
        order: 1
      },
      {
        title: 'Product Page Optimization',
        content: 'Optimize product pages for better conversion rates.',
        order: 2
      },
      {
        title: 'Shopping Campaigns & Retargeting',
        content: 'Create effective shopping campaigns and retargeting strategies.',
        order: 3
      },
      {
        title: 'E-commerce Analytics & CRO',
        content: 'Analyze store performance and optimize for conversions.',
        order: 4
      },
      {
        title: 'Customer Retention Strategies',
        content: 'Implement strategies to retain and upsell customers.',
        order: 5
      }
    ];

    await Promise.all(module7Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module7.id
      })
    ));

    // Add quiz for Module 7
    const module7Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module7.id,
      title: 'E-commerce Marketing Quiz',
      description: 'Test your knowledge of e-commerce marketing concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 7 quiz
    const module7Questions = [
      {
        text: 'What is the average e-commerce conversion rate?',
        points: 1,
        options: [
          '1-2%',
          '3-4%',
          '5-6%',
          '7-8%'
        ],
        correctAnswer: '1-2%'
      },
      {
        text: 'Which is NOT a key element of product page optimization?',
        points: 1,
        options: [
          'High-quality images',
          'Clear pricing',
          'Hidden shipping costs',
          'Customer reviews'
        ],
        correctAnswer: 'Hidden shipping costs'
      },
      {
        text: 'What is cart abandonment?',
        points: 1,
        options: [
          'Customers leaving items in their cart',
          'Deleting products from inventory',
          'Removing items from wishlist',
          'Canceling orders'
        ],
        correctAnswer: 'Customers leaving items in their cart'
      },
      {
        text: 'Which platform is best for e-commerce retargeting?',
        points: 1,
        options: [
          'Google Ads',
          'LinkedIn',
          'TikTok',
          'Snapchat'
        ],
        correctAnswer: 'Google Ads'
      },
      {
        text: 'What is a good customer retention rate?',
        points: 1,
        options: [
          '10-20%',
          '30-40%',
          '50-60%',
          '70-80%'
        ],
        correctAnswer: '50-60%'
      }
    ];

    await Promise.all(module7Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module7Quiz.id
      })
    ));

    // Module 8: AI in Marketing
    const module8 = await Module.create({
      courseId: course[0].id,
      title: 'AI in Marketing',
      description: 'Learn to leverage AI tools for marketing automation',
      order: 8,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 8
    const module8Lessons = [
      {
        title: 'AI Marketing Tools Overview',
        content: 'Explore various AI tools available for marketing automation.',
        order: 1
      },
      {
        title: 'ChatGPT for Marketing',
        content: 'Learn to use ChatGPT for content creation and marketing tasks.',
        order: 2
      },
      {
        title: 'AI-Powered Analytics',
        content: 'Use AI to analyze marketing data and gain insights.',
        order: 3
      },
      {
        title: 'Automated Content Creation',
        content: 'Create and optimize content using AI tools.',
        order: 4
      },
      {
        title: 'AI in Customer Service',
        content: 'Implement AI solutions for customer service automation.',
        order: 5
      }
    ];

    await Promise.all(module8Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module8.id
      })
    ));

    // Add quiz for Module 8
    const module8Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module8.id,
      title: 'AI in Marketing Quiz',
      description: 'Test your knowledge of AI marketing concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 8 quiz
    const module8Questions = [
      {
        text: 'What is the main benefit of AI in marketing?',
        points: 1,
        options: [
          'Reducing costs',
          'Automating repetitive tasks',
          'Increasing social media followers',
          'Improving website design'
        ],
        correctAnswer: 'Automating repetitive tasks'
      },
      {
        text: 'Which is NOT a common use of ChatGPT in marketing?',
        points: 1,
        options: [
          'Content creation',
          'Customer service',
          'Direct sales',
          'Market research'
        ],
        correctAnswer: 'Direct sales'
      },
      {
        text: 'What is predictive analytics?',
        points: 1,
        options: [
          'Analyzing past data',
          'Forecasting future trends',
          'Creating reports',
          'Managing social media'
        ],
        correctAnswer: 'Forecasting future trends'
      },
      {
        text: 'Which AI tool is best for customer service?',
        points: 1,
        options: [
          'Chatbots',
          'Image generators',
          'Video editors',
          'Social media schedulers'
        ],
        correctAnswer: 'Chatbots'
      },
      {
        text: 'What is the role of AI in content optimization?',
        points: 1,
        options: [
          'Writing entire articles',
          'Suggesting improvements',
          'Deleting content',
          'Changing website design'
        ],
        correctAnswer: 'Suggesting improvements'
      }
    ];

    await Promise.all(module8Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module8Quiz.id
      })
    ));

    // Module 9: Video Marketing
    const module9 = await Module.create({
      courseId: course[0].id,
      title: 'Video Marketing',
      description: 'Master video content creation and distribution',
      order: 9,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 9
    const module9Lessons = [
      {
        title: 'Video Content Strategy',
        content: 'Develop effective video content strategies for different platforms.',
        order: 1
      },
      {
        title: 'Video Production Basics',
        content: 'Learn essential video production techniques and tools.',
        order: 2
      },
      {
        title: 'Platform-Specific Video Optimization',
        content: 'Optimize videos for different social media platforms.',
        order: 3
      },
      {
        title: 'Video Analytics & Performance',
        content: 'Track and analyze video performance metrics.',
        order: 4
      },
      {
        title: 'Live Streaming & Webinars',
        content: 'Plan and execute successful live streams and webinars.',
        order: 5
      }
    ];

    await Promise.all(module9Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module9.id
      })
    ));

    // Add quiz for Module 9
    const module9Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module9.id,
      title: 'Video Marketing Quiz',
      description: 'Test your knowledge of video marketing concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 9 quiz
    const module9Questions = [
      {
        text: 'What is the ideal length for a social media video?',
        points: 1,
        options: [
          '1-2 minutes',
          '5-10 minutes',
          '15-20 minutes',
          '30+ minutes'
        ],
        correctAnswer: '1-2 minutes'
      },
      {
        text: 'Which platform is best for long-form video content?',
        points: 1,
        options: [
          'TikTok',
          'Instagram',
          'YouTube',
          'Twitter'
        ],
        correctAnswer: 'YouTube'
      },
      {
        text: 'What is a video thumbnail?',
        points: 1,
        options: [
          'The video description',
          'The preview image',
          'The video title',
          'The video tags'
        ],
        correctAnswer: 'The preview image'
      },
      {
        text: 'Which metric is most important for video engagement?',
        points: 1,
        options: [
          'Views',
          'Watch time',
          'Likes',
          'Comments'
        ],
        correctAnswer: 'Watch time'
      },
      {
        text: 'What is the purpose of video SEO?',
        points: 1,
        options: [
          'Improving video quality',
          'Increasing video visibility',
          'Reducing file size',
          'Adding special effects'
        ],
        correctAnswer: 'Increasing video visibility'
      }
    ];

    await Promise.all(module9Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module9Quiz.id
      })
    ));

    // Module 10: Marketing Automation
    const module10 = await Module.create({
      courseId: course[0].id,
      title: 'Marketing Automation',
      description: 'Learn to automate marketing processes and workflows',
      order: 10,
      isPublished: true,
      publishedAt: new Date()
    });

    // Add lessons for Module 10
    const module10Lessons = [
      {
        title: 'Marketing Automation Platforms',
        content: 'Explore different marketing automation tools and platforms.',
        order: 1
      },
      {
        title: 'Workflow Design & Implementation',
        content: 'Design and implement automated marketing workflows.',
        order: 2
      },
      {
        title: 'Lead Scoring & Nurturing',
        content: 'Set up lead scoring and automated nurturing campaigns.',
        order: 3
      },
      {
        title: 'Multi-channel Automation',
        content: 'Create automated campaigns across multiple channels.',
        order: 4
      },
      {
        title: 'Automation Analytics & Optimization',
        content: 'Track and optimize automated marketing campaigns.',
        order: 5
      }
    ];

    await Promise.all(module10Lessons.map(lesson =>
      Lesson.create({
        ...lesson,
        moduleId: module10.id
      })
    ));

    // Add quiz for Module 10
    const module10Quiz = await Quiz.create({
      courseId: course[0].id,
      moduleId: module10.id,
      title: 'Marketing Automation Quiz',
      description: 'Test your knowledge of marketing automation concepts',
      duration: 30,
      totalPoints: 5,
      status: 'published'
    });

    // Add questions for Module 10 quiz
    const module10Questions = [
      {
        text: 'What is the main benefit of marketing automation?',
        points: 1,
        options: [
          'Reducing costs',
          'Saving time',
          'Increasing social media followers',
          'Improving website design'
        ],
        correctAnswer: 'Saving time'
      },
      {
        text: 'Which is NOT a common marketing automation tool?',
        points: 1,
        options: [
          'HubSpot',
          'Mailchimp',
          'Photoshop',
          'Marketo'
        ],
        correctAnswer: 'Photoshop'
      },
      {
        text: 'What is lead scoring?',
        points: 1,
        options: [
          'Grading customer service',
          'Rating potential customers',
          'Measuring social media engagement',
          'Calculating ROI'
        ],
        correctAnswer: 'Rating potential customers'
      },
      {
        text: 'Which automation is most effective for lead nurturing?',
        points: 1,
        options: [
          'Email sequences',
          'Social media posts',
          'Website updates',
          'Phone calls'
        ],
        correctAnswer: 'Email sequences'
      },
      {
        text: 'What is a marketing automation workflow?',
        points: 1,
        options: [
          'A series of automated actions',
          'A customer service process',
          'A content calendar',
          'A budget plan'
        ],
        correctAnswer: 'A series of automated actions'
      }
    ];

    await Promise.all(module10Questions.map(question =>
      QuizQuestion.create({
        ...question,
        quizId: module10Quiz.id
      })
    ));

    console.log('Successfully seeded the database with Advanced Digital Marketing course data');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seed function
seedData(); 