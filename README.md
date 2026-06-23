# 🎓 StudyFlow AI Agent

An AI-powered academic productivity platform that helps students plan, organize, track, and optimize their studies through intelligent scheduling, revision management, analytics, and AI assistance.

---

# 📖 Overview

StudyFlow AI Agent is designed to solve one of the biggest challenges faced by students: managing studies efficiently while staying consistent.

Most students struggle with:

* Managing multiple subjects simultaneously
* Planning studies before examinations
* Tracking assignments and deadlines
* Revising topics effectively
* Identifying weak areas
* Maintaining study consistency
* Finding personalized academic guidance

StudyFlow AI Agent combines traditional productivity tools with Artificial Intelligence to create a unified study management system.

Instead of using separate applications for task management, revision tracking, scheduling, and academic assistance, students can manage everything from one platform.

---

## 🌐 Live Demo

### Frontend Application

https://studyflow-ai-frontend.onrender.com

### Backend API

https://studyflow-ai-backend-xg0u.onrender.com

---

## 🚀 Deployment

StudyFlow AI Agent is deployed and publicly accessible using:

* Frontend Hosting: Render Static Site
* Backend Hosting: Render Web Service
* Database: MongoDB Atlas
* AI Integration: Google Gemini API

The application supports:

* User Authentication
* Task Management
* AI-Powered Study Plan Generation
* Revision Tracking
* Dashboard Analytics
* Dark/Light Theme
* Persistent Cloud Storage

---

## 📌 Current Version

**Version:** v1.0.0

**Release Date:** June 2026

**Status:** Stable Production Release

### Release Highlights

* Production deployment completed
* User authentication system implemented
* AI study planner integrated with Gemini
* Revision Assistant launched
* Dashboard analytics added
* Responsive user interface completed
* MongoDB Atlas cloud integration configured
* Public release published on GitHub

---

# 🎯 Problem Statement

Students often face problems such as:

### Poor Time Management

Students know what to study but often do not know when to study it.

### Lack of Structured Planning

Study schedules are usually created manually and are difficult to maintain.

### Ineffective Revision

Students frequently forget previously learned concepts due to inconsistent revision habits.

### Overwhelming Workload

Managing assignments, exams, projects, and multiple subjects simultaneously can become overwhelming.

### Lack of Personalized Guidance

Most productivity applications provide generic suggestions rather than recommendations tailored to individual academic needs.

StudyFlow AI Agent addresses these challenges by combining planning, tracking, analytics, and AI-powered guidance into a single system.

---

# ✨ Key Features

---

## 🔐 Authentication System

Secure authentication system for personalized study management.

### Features

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Persistent Login Sessions

### Benefits

Each student maintains a separate workspace, study plans, tasks, and revision history.

---

## 📊 Dashboard Analytics

The dashboard serves as the central overview of academic productivity.

### Dashboard Displays

* Total Tasks
* Completed Tasks
* Pending Tasks
* Completion Rate
* Subject Distribution
* Task Timeline
* AI Recommendations
* Upcoming Deadlines
* Recent Activities

### Benefits

Provides instant insight into study progress and workload distribution.

---

## ✅ Task Management System

Comprehensive task management functionality.

### Create Tasks

Students can create tasks with:

* Title
* Description
* Subject
* Priority
* Deadline
* Status

### Manage Tasks

Students can:

* View tasks
* Edit tasks
* Delete tasks
* Update progress
* Organize by subject

### Task Statuses

* Pending
* In Progress
* Completed

### Benefits

Helps students stay organized and prevents missing important deadlines.

---

## 🤖 AI-Powered Recommendations

The system automatically analyzes tasks and deadlines to generate recommendations.

### Recommendation Factors

* Task Priority
* Deadline Urgency
* Completion Status
* Workload Distribution

### Example Recommendations

* Complete high-priority assignments first
* Focus on approaching deadlines
* Allocate more time to difficult subjects
* Balance workload across subjects

### Benefits

Provides actionable guidance without requiring manual analysis.

---

## 📚 Study Plan Generator

The Study Plan Generator creates personalized academic schedules.

### Input Parameters

Students provide:

* Exam Name
* Exam Date
* Daily Study Hours
* Subjects
* Weak Topics
* Syllabus Information

### Generated Output

The system automatically generates:

* Subject-wise priorities
* Daily study schedules
* Study sessions
* Topic distribution
* Revision allocation

### Benefits

Eliminates manual study planning and improves preparation efficiency.

---

## 📅 Study Session Management

Generated study plans are divided into structured study sessions.

### Session Information

Each session contains:

* Subject
* Focus Area
* Planned Date
* Duration
* Status

### Session Tracking

Students can:

* Mark Completed
* Mark Missed
* Reset Status

### Benefits

Provides measurable progress tracking and accountability.

---

## 🔄 Adaptive Replanning

StudyFlow supports dynamic plan recalculation.

### Features

* Recalculate study schedules
* Adjust plans after missed sessions
* Update study priorities

### Benefits

Allows plans to remain realistic and adaptive to changing circumstances.

---

## 📝 Revision Assistant

The Revision Assistant helps students maintain consistent revision habits.

### Features

* Track revision topics
* Monitor revision progress
* View revision history
* Generate revision suggestions
* Identify pending revisions

### Benefits

Supports long-term retention through systematic revision tracking.

---

## 🤖 StudyFlow AI Assistant

StudyFlow includes an AI-powered academic assistant built using Google's Gemini AI.

### Capabilities

#### Concept Explanation

Examples:

* Explain DBMS normalization
* Explain operating system scheduling
* Explain machine learning basics

#### Study Planning

Examples:

* Create a 7-day DBMS revision plan
* Generate a 14-day DSA preparation schedule
* Build a timetable for 3 study hours daily

#### Exam Preparation

Examples:

* How should I prepare for my DBMS exam?
* What topics should I prioritize for DSA interviews?

#### Productivity Guidance

Examples:

* How can I avoid procrastination?
* How can I improve study consistency?

### Features

* Natural language conversations
* Markdown-formatted responses
* Structured study plans
* Personalized guidance

### Benefits

Provides instant academic support without leaving the platform.

---

## 🌙 Dark Mode Support

The platform includes a dark mode interface.

### Benefits

* Reduced eye strain
* Better nighttime usability
* Improved user experience

---

# 🏗 System Architecture

Frontend (React + Vite)
↓
REST API (Express.js)
↓
MongoDB Atlas
↓
Gemini AI Services

---

# 💻 Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* React Markdown
* React Hot Toast

---

## Backend

* Node.js
* Express.js

---

## Database

* MongoDB Atlas
* Mongoose

---

## Authentication

* JWT (JSON Web Tokens)

---

## Artificial Intelligence

* Google Gemini API
* Gemini 2.5 Flash Model

---

# 👨‍🎓 Intended Users

StudyFlow AI Agent is designed for:

### Students

* School Students
* College Students
* University Students

### Competitive Exam Aspirants

* GATE
* CAT
* UPSC
* Government Exams

### Self Learners

* Online Course Learners
* Certification Learners
* Skill Development Enthusiasts

---

# 🚀 Installation Guide

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd StudyFlow-AI-Agent
```

## Step 2: Install Frontend Dependencies

```bash
cd client
npm install
```

## Step 3: Install Backend Dependencies

```bash
cd ../server
npm install
```

## Step 4: Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## Step 5: Start Backend

```bash
cd server
npm run dev
```

---

## Step 6: Start Frontend

```bash
cd client
npm run dev
```

---

# 📁 Project Structure

```text
StudyFlow-AI-Agent
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   └── assets
│
├── server
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── models
│   ├── config
│   └── utils
│
├── README.md
├── FUTURE_SCOPE.md
└── LICENSE
```

---

# 🔒 Security Features

* JWT Authentication
* Protected API Routes
* Password Protection
* Secure User Sessions
* Environment Variable Management

---

# 📈 Current Version

## StudyFlow AI v1.0

### Included Features

* Authentication
* Dashboard Analytics
* Task Management
* AI Recommendations
* Study Plan Generator
* Study Session Tracking
* Revision Assistant
* Gemini AI Chat Assistant
* Dark Mode Support

---

# 🛣 Roadmap

Future development plans are available in:

```text
FUTURE_SCOPE.md
```

---

# 🤝 Contribution

Contributions, feature suggestions, bug reports, and improvements are welcome.

Future versions will continue expanding StudyFlow into a complete AI-powered academic productivity ecosystem.

---

# 👩‍💻 Author

**Varnika Sharma**

B.Tech Computer Science Engineering

Lovely Professional University

---

# 📄 License

This project is intended for educational, academic, and research purposes.
