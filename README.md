# Task Manager

A full stack task management application built with Spring Boot and React.

**Live Application:** https://task-manager-backend-one-wheat.vercel.app  
**API:** https://task-manager-backend-3rq7.onrender.com

---

## Overview

Users can register an account, log in, and manage their personal tasks. Each task supports a title, description, due date, and priority level. The application is secured with JWT authentication — every user only sees and manages their own tasks.

---

## Features

- User registration and login with JWT authentication
- Create, edit, and delete tasks
- Set priority levels: Low, Medium, High
- Set due dates with automatic overdue detection
- Filter tasks by status (pending / completed) or priority
- Mark tasks as complete
- Paginated task list
- Dashboard with task count stats

---

## Tech Stack

**Backend**
- Java 17
- Spring Boot 3.2
- Spring Security with JWT (JJWT)
- Spring Data JPA
- H2 in-memory database
- Maven

**Frontend**
- React 19 with TypeScript
- Vite
- Tailwind CSS
- TanStack Query (React Query)
- React Hook Form with Zod validation
- Axios
- React Router

**Deployment**
- Backend: Render (Docker)
- Frontend: Vercel

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/tasks` | Get all tasks (paginated, filterable) | Yes |
| GET | `/api/tasks/{id}` | Get a single task | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/{id}` | Update a task | Yes |
| PATCH | `/api/tasks/{id}/complete` | Mark task as complete | Yes |
| PATCH | `/api/tasks/{id}/priority` | Update task priority | Yes |
| DELETE | `/api/tasks/{id}` | Delete a task | Yes |
| GET | `/api/tasks/overdue` | Get overdue tasks | Yes |

---

## Running Locally

**Prerequisites:** Java 17, Node.js 18+

**Backend**
```bash
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`  
H2 console available at `http://localhost:8080/h2-console`

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

---

## Project Structure

```
task-manager-backend/
  src/                        # Spring Boot application
    main/java/com/anushka/taskmanager/
      config/                 # Security and CORS configuration
      controller/             # REST controllers
      dto/                    # Request and response DTOs
      exception/              # Global exception handling
      model/                  # JPA entities
      repository/             # Spring Data repositories
      security/               # JWT filter and user details service
      service/                # Business logic
    main/resources/
      application.properties
  frontend/                   # React application
    src/
      api/                    # Axios instance and API calls
      components/             # Reusable UI components
      context/                # Auth context
      pages/                  # Login, Register, Dashboard
      types/                  # TypeScript types
  Dockerfile                  # Docker build for Render deployment
```

---

## Notes

- Data resets on every backend restart since H2 is an in-memory database
- The Render free tier sleeps after 15 minutes of inactivity — the first request after sleep may take around 30 seconds
