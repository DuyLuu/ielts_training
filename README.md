# YouPass IELTS Training Platform

A comprehensive platform for IELTS preparation inspired by YouPass.vn, offering courses, practice tests, progress tracking, and community features.

## Features

- User authentication (email/password and Google OAuth)
- Course management with video lessons and downloadable resources
- Practice tests for all IELTS sections (Reading, Writing, Listening, Speaking)
- Progress tracking with visual dashboards
- Community forum and study groups
- Multilingual support (English and Vietnamese)
- Responsive design for mobile and desktop

## Tech Stack

### Backend
- Node.js with Express
- MongoDB for database
- Passport.js for authentication
- JWT for authorization
- AWS S3 for file storage

### Frontend
- React.js with TypeScript
- Redux for state management
- Tailwind CSS for styling
- Chart.js for data visualization
- Axios for API requests

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` file
4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/v1/auth/register - Register a new user
- POST /api/v1/auth/login - Login user
- GET /api/v1/auth/profile - Get user profile
- PATCH /api/v1/auth/profile - Update user profile

### Courses
- GET /api/v1/courses - Get all courses
- GET /api/v1/courses/:id - Get course details
- POST /api/v1/courses - Create new course (admin only)
- PATCH /api/v1/courses/:id - Update course (admin only)
- DELETE /api/v1/courses/:id - Delete course (admin only)

### Tests
- GET /api/v1/tests - Get available tests
- GET /api/v1/tests/:id - Get test details
- POST /api/v1/tests/:id/submit - Submit test answers

## License

This project is licensed under the MIT License.

## Acknowledgements

This project is inspired by [YouPass.vn](https://youpass.vn/home) and is created for educational purposes. 