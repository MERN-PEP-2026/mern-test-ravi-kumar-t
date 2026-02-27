# Course Management System (MERN)

A full-stack **Course Management System** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.

The system supports **role-based access control** where:

- **Admins** manage courses
- **Students** enroll in courses

---

# Live Application

### Frontend (Vercel)

https://mern-test-ravi-kumar-t.vercel.app/

### Backend API (Render)

https://course-management-backend-988z.onrender.com

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
- Loading Skeletons
- Modern minimal UI
- Protected routes

---

# Tech Stack

## Frontend
- React
- React Router
- Axios
- Vite
- CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

# Project Structure

```
mern-test-ravi-kumar-t
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
│   ├── public
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

# Local Installation

## 1 Clone Repository

```bash
git clone https://github.com/ravi-kumar-t/mern-test-ravi-kumar-t.git
cd mern-test-ravi-kumar-t
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside **backend** folder.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

Backend will run at:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Environment Variables

Frontend `.env`

```
VITE_API_URL=https://course-management-backend-988z.onrender.com
```

Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
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

### Frontend
Deployed on **Vercel**

### Backend
Deployed on **Render**

### Database
Hosted on **MongoDB Atlas**

---

# Author

**Ravi Kumar Tekkali**

B.Tech Computer Science Engineering  
Lovely Professional University

GitHub  
https://github.com/ravi-kumar-t

---

# Future Improvements

- Course progress tracking
- Admin analytics dashboard
- Course search & filtering
- Pagination
- Email notifications
- Course categories