# LMS Portal

A Learning Management System built with React and Node.js.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd LMS_PORTAL
```

### 2. Database Setup
1. Create a new PostgreSQL database
2. Copy the `.env.example` file to `.env` in the server directory:
```bash
cd server
cp .env.example .env
```
3. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=5432
```

### 3. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Seed the Database
```bash
cd ../server
node src/seed.js
```
This will create:
- An instructor account (email: instructor@example.com, password: password123)
- A student account (email: student@example.com, password: password123)
- Sample courses with modules, lessons, and quizzes

### 5. Start the Application
```bash
# Start the server (from server directory)
npm start

# Start the client (from client directory)
cd ../client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Default Accounts

### Instructor Account
- Email: instructor@example.com
- Password: password123

### Student Account
- Email: student@example.com
- Password: password123

## Features
- Course management
- Module and lesson creation
- Quiz system
- Student progress tracking
- Course enrollment
- User authentication and authorization

## Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT