# LMS Portal Backend Server

This is the backend server for the LMS Portal application, built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=5000

# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=lms_portal
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

3. Create the database:
```bash
createdb lms_portal
```

4. Run migrations:
```bash
npm run migrate
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login`
  - Body: `{ email, password, role }`
  - Returns: `{ token, user }`

- `POST /api/auth/register` (Admin only)
  - Body: `{ email, password, firstName, lastName, role }`
  - Returns: `{ message, user }`

- `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Returns: User object

### Courses

- `GET /api/courses`
  - Headers: `Authorization: Bearer <token>`
  - Returns: List of courses (filtered by role)

- `GET /api/courses/:id`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Course details

- `POST /api/courses` (Instructor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: Course object
  - Returns: Created course

- `PUT /api/courses/:id` (Instructor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: Course updates
  - Returns: Updated course

- `DELETE /api/courses/:id` (Instructor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success message

### Modules

- `GET /api/modules/course/:courseId`
  - Headers: `Authorization: Bearer <token>`
  - Returns: List of modules for a course

- `GET /api/modules/:id`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Module details

- `POST /api/modules` (Instructor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: Module object
  - Returns: Created module

- `PUT /api/modules/:id` (Instructor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: Module updates
  - Returns: Updated module

- `DELETE /api/modules/:id` (Instructor/Admin only)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success message

## Data Migration

To migrate data from localStorage to PostgreSQL:

1. Export your localStorage data to a JSON file
2. Update the `sampleData` object in `scripts/migrateData.js`
3. Run the migration script:
```bash
node scripts/migrateData.js
```

## Development

### Scripts

- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run migrate`: Run database migrations

### Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   └── index.js        # Main application file
├── scripts/            # Utility scripts
├── .env.example        # Example environment variables
└── package.json        # Project dependencies
```

## Security

- JWT authentication
- Role-based access control
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error message",
  "stack": "Error stack trace (development only)"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 