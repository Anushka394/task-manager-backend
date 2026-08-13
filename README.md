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
- Overdue task notifications — alert banner, navbar badge, overdue filter tab, and highlighted task cards
- Filter tasks by status (pending / completed), priority, or overdue
- Mark tasks as complete
- Paginated task list
- Dashboard with task count stats (Total, Pending, Completed, Overdue)

---

## Tech Stack

**Backend**
- Java 17
- Spring Boot 3.2.5
- Spring Security 6 with stateless JWT authentication (JJWT 0.12.5)
- Spring Data JPA with Hibernate
- Spring Boot Validation (Jakarta Bean Validation)
- Spring Boot Actuator (health endpoint)
- H2 in-memory database
- Lombok
- Maven (via Maven Wrapper)

**Frontend**
- React 19 with TypeScript 5.8
- Vite 6
- Tailwind CSS 4
- TanStack Query (React Query) v5 — server state management and caching
- React Hook Form v7 with Zod v4 — form handling and schema validation
- @hookform/resolvers — Zod adapter for React Hook Form
- Axios — HTTP client
- React Router v7

**Dev / Tooling**
- ESLint 9 with typescript-eslint and react-hooks plugin
- @vitejs/plugin-react — Vite React plugin (Babel fast refresh)
- Docker — containerised backend for deployment

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
| GET | `/api/tasks/overdue` | Get all overdue tasks | Yes |

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
task-manager-FS/
  src/                        # Spring Boot application
    main/java/com/anushka/taskmanager/
      config/                 # Security, CORS, and JPA auditing config
      controller/             # REST controllers (Auth, Task)
      dto/                    # Request and response DTOs
      exception/              # Global exception handler
      model/                  # JPA entities (User, Task, Priority)
      repository/             # Spring Data JPA repositories
      security/               # JWT filter, JwtService, CustomUserDetailsService
      service/                # Business logic
    main/resources/
      application.properties
  frontend/                   # React application
    src/
      api/                    # Axios instance and API call functions
      components/             # Navbar, TaskCard, TaskModal, PriorityBadge, ProtectedRoute
      context/                # AuthContext (JWT + user state)
      pages/                  # LoginPage, RegisterPage, DashboardPage
      types/                  # Shared TypeScript types
  Dockerfile                  # Docker build for Render deployment
```

---

## Notes

- Data resets on every backend restart since H2 is an in-memory database
- The Render free tier sleeps after 15 minutes of inactivity — the first request after sleep may take around 30 seconds
- JWT is stored in `localStorage`; suitable for development and demos
