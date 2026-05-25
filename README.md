# Team Task Manager

A full-stack team task management application for organizing projects, assigning tasks, and tracking progress with role-based access control.

Built using **React**, **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**. 

---

## Features

### Authentication

* User signup and login
* JWT-based authentication
* Role-based access (`admin` / `member`)
* Protected routes

### Project Management

* Create and manage projects
* Assign members to projects
* View assigned projects

### Task Management

* Create tasks
* Assign tasks to team members
* Update task status
* Delete tasks

### Dashboard

* Total tasks
* Completed tasks
* Pending tasks
* Overdue tasks

---

## Tech Stack

| Layer          | Technologies                     |
| -------------- | -------------------------------- |
| Frontend       | React, Vite, Tailwind CSS, Axios |
| Backend        | Node.js, Express.js              |
| Database       | MongoDB, Mongoose                |
| Authentication | JWT, bcryptjs                    |

---

## Project Structure

```bash
Team-Task-Manager/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── layouts/
│   └── package.json
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── validators/
├── server.js
├── .env.example
└── package.json
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/Team-Task-Manager.git
cd Team-Task-Manager
```

---

## Backend Setup

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Frontend Setup

Move to client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## API Endpoints

### Auth Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup` | Register user |
| POST   | `/api/auth/login`  | Login user    |

### Project Routes

| Method | Endpoint            | Access         |
| ------ | ------------------- | -------------- |
| GET    | `/api/projects`     | Admin / Member |
| POST   | `/api/projects`     | Admin only     |
| GET    | `/api/projects/:id` | Assigned users |

### Task Routes

| Method | Endpoint         | Access                  |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/tasks`     | Admin / Member          |
| POST   | `/api/tasks`     | Admin only              |
| PUT    | `/api/tasks/:id` | Admin / Assigned member |
| DELETE | `/api/tasks/:id` | Admin only              |

### Dashboard Route

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | `/api/dashboard/stats` |

---

## Task Status Values

```text
Todo
In Progress
Completed
```

---

## Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

## Deployment

| Service | Platform |
| ------- | -------- |
| Frontend | [Vercel](https://vercel.com) (root directory: `client`) |
| Backend | [Railway](https://railway.app) (repo root) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

Step-by-step setup: **[DEPLOYMENT.md](./DEPLOYMENT.md)**  
Pre-launch checklist: **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)**

---

## Environment Variables

### Backend

```env
PORT=
NODE_ENV=production
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRE=7d
CLIENT_URL=
```

### Frontend

```env
VITE_API_URL=
```

---

## Security Notes

* Never commit `.env` files
* Use strong JWT secrets
* Use HTTPS in production
* Store passwords securely using bcrypt

---

## Future Improvements

* Email notifications
* File attachments
* Activity logs
* Team chat
* Dark mode
* Real-time updates with Socket.io

---
