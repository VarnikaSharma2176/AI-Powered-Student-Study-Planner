# AI-Powered Student Study Planner and Productivity Management System

A full-stack AI-assisted productivity platform designed to help students manage study schedules, organize academic tasks, improve time management, and track learning productivity through intelligent recommendations and analytics.

--------------------------------------------------

PROJECT OVERVIEW

The AI-Powered Student Study Planner is a modern MERN stack web application that combines task management, productivity analytics, and AI-driven study recommendations into a single platform.

The system allows students to:
- manage academic tasks
- organize study schedules
- monitor productivity
- analyze progress
- receive AI-based study recommendations
- track deadlines and completion rates

The application demonstrates practical implementation of:
- full stack web development
- REST API architecture
- JWT authentication
- MongoDB database integration
- AI-assisted recommendation systems
- responsive frontend development
- analytics and visualization

--------------------------------------------------

FEATURES

1. Authentication System
- User registration
- Secure login/logout
- JWT-based authentication
- Protected routes
- Persistent sessions
- User-specific dashboards

2. Task Management
- Create study tasks
- Update tasks
- Delete tasks
- Mark tasks as completed
- Assign priorities
- Add deadlines
- Add estimated study hours
- Categorize by subject
- Difficulty tracking
- Filter and search tasks

3. AI Recommendation Engine
The platform includes a rule-based AI productivity engine that:
- prioritizes urgent tasks
- detects overdue work
- recommends study focus areas
- balances workload
- identifies difficult subjects
- generates personalized study suggestions

AI recommendation logic considers:
- task priority
- task difficulty
- deadline proximity
- completion status
- overdue tasks

4. Analytics Dashboard
Interactive dashboard includes:
- total task count
- completed tasks
- pending tasks
- overdue tasks
- completion percentage
- subject-wise distribution
- productivity charts
- task timeline visualization
- upcoming deadlines
- recent tasks

5. Responsive UI
- Modern professional interface
- Mobile responsive layout
- Shared app shell
- Sidebar navigation
- Dashboard analytics cards
- Interactive charts

--------------------------------------------------

TECH STACK

Frontend:
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- React Hot Toast
- Lucide React Icons

Backend:
- Node.js
- Express.js
- JWT Authentication
- REST APIs
- Middleware architecture

Database:
- MongoDB Atlas
- Mongoose ODM

--------------------------------------------------

PROJECT STRUCTURE

AI-Study-Planner/

client/
- src/
  - components/
  - context/
  - pages/
  - services/
  - App.jsx
  - main.jsx

server/
- config/
- controllers/
- middleware/
- models/
- routes/
- server.js

README.md
.gitignore

--------------------------------------------------

DATABASE MODELS

User Model:
- name
- email
- password
- timestamps

Task Model:
- user
- title
- subject
- description
- deadline
- estimatedHours
- difficulty
- priority
- status
- timestamps

--------------------------------------------------

API ENDPOINTS

Authentication Routes:
- POST /api/auth/register
- POST /api/auth/login

Task Routes:
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- GET /api/tasks/stats

Recommendation Routes:
- GET /api/recommendations

--------------------------------------------------

ENVIRONMENT VARIABLES

Server .env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Client .env

VITE_API_URL=http://localhost:5000

--------------------------------------------------

INSTALLATION AND SETUP

1. Clone Repository

git clone https://github.com/your-username/ai-study-planner.git

2. Install Frontend Dependencies

cd client
npm install

3. Install Backend Dependencies

cd server
npm install

--------------------------------------------------

RUNNING THE APPLICATION

Start Backend Server:

cd server
npm run dev

Backend runs on:
http://localhost:5000

Start Frontend:

cd client
npm run dev

Frontend runs on:
http://localhost:5173

--------------------------------------------------

AUTHENTICATION FLOW

1. User registers or logs in
2. JWT token is generated
3. Token is stored in localStorage
4. Protected routes verify authentication
5. Authorized requests include Bearer token

--------------------------------------------------

AI RECOMMENDATION LOGIC

The recommendation engine calculates task priority using:
- urgency
- deadline proximity
- difficulty level
- completion status
- overdue detection

Tasks are scored dynamically to generate intelligent study recommendations.

--------------------------------------------------

DASHBOARD ANALYTICS

The dashboard provides:
- task completion tracking
- subject distribution analysis
- productivity visualization
- overdue task detection
- upcoming deadline monitoring
- study workload insights

--------------------------------------------------

SECURITY FEATURES

- Password hashing using bcrypt
- JWT authentication
- Protected API routes
- User-specific task isolation
- Secure middleware validation
- Environment variable protection

--------------------------------------------------

FUTURE ENHANCEMENTS

Potential future improvements:
- Pomodoro timer
- Calendar integration
- Email notifications
- Mobile application
- Machine learning recommendations
- Dark mode
- Exam preparation mode
- Study streak tracking
- Collaborative study groups
- Voice assistant integration
- Cloud deployment optimization

--------------------------------------------------

DEPLOYMENT PLAN

Frontend Deployment:
- Vercel

Backend Deployment:
- Render

Database:
- MongoDB Atlas

--------------------------------------------------

SCREENSHOTS

Add screenshots here after deployment:
- screenshots/dashboard.png
- screenshots/tasks.png
- screenshots/login.png

--------------------------------------------------

LEARNING OUTCOMES

This project demonstrates:
- full stack development
- frontend/backend integration
- REST API development
- JWT authentication
- MongoDB database design
- responsive UI development
- analytics dashboard creation
- AI-assisted recommendation systems
- deployment-ready architecture

--------------------------------------------------

AUTHOR

Varnika Sharma
B.Tech CSE (Data Science Specialization)

--------------------------------------------------

LICENSE

This project is intended for educational, portfolio, and internship demonstration purposes.