# Course Management System (MERN)

A full-stack **Course Management System** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
The system supports **role-based access control** where **Admins manage courses** and **Students enroll in courses**.

---

# Features

## Authentication
- JWT-based login and registration
- Secure password hashing using bcrypt
- Role-based access control (Admin / Student)

## Admin Features
- Create new courses
- Edit courses
- Delete courses
- View enrolled students

## Student Features
- Browse available courses
- Enroll in courses
- Leave courses
- View profile page

## UI Features
- Responsive Dashboard
- Toast Notifications
- Modern minimal UI

---

# 🛠 Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

# Project Structure

```
course-management-system
│
├── backend
│   ├── middleware
│   │   ├── verifyToken.js
│   │   └── isAdmin.js
│   │
│   ├── models
│   │   ├── Student.js
│   │   └── Course.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── courseRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Installation

## 1 Clone Repository

```
git clone https://github.com/ravi-kumar-t/mern-test-ravi-kumar-t.git
cd mern-test-ravi-kumar-t
```

---

# 2️ Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside **backend** folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

# 3️ Frontend Setup

Open another terminal:

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

## Courses

```
GET    /api/courses
POST   /api/courses           (Admin only)
PUT    /api/courses/:id       (Admin only)
DELETE /api/courses/:id       (Admin only)

POST   /api/courses/:id/enroll
DELETE /api/courses/:id/leave
```

---

# Security

- Password hashing using **bcrypt**
- JWT authentication
- Protected API routes
- Admin-only middleware

---

# Deployment

Frontend: **Vercel**  
Backend: **Render**  
Database: **MongoDB Atlas**

---

#  Author

**Ravi Kumar Tekkali**  
B.Tech Computer Science Engineering  
Lovely Professional University  

GitHub:  
https://github.com/ravi-kumar-t

---

# ⭐ Future Improvements

- Course progress tracking
- Admin analytics dashboard
- Search & filtering
- Pagination
- Email notifications

---