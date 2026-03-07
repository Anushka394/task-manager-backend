# Task Manager API

Spring Boot based REST API for managing tasks with user authentication.

## Features
- User registration and login
- CRUD operations for tasks
- Task filtering by priority, completion status, and due date
- Password encryption with BCrypt
- HTTP Basic Authentication

## Tech Stack
- Spring Boot 4.0.3
- Java 17
- MySQL
- Spring Security
- Spring Data JPA
- Maven

## Setup

1. Create MySQL database:
```sql
CREATE DATABASE task_manager;
```

2. Update `application.properties` with your MySQL credentials

3. Run the application:
```bash
./mvnw spring-boot:run
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Requires Authentication)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Mark task as completed
- `GET /api/tasks/priority/{priority}` - Get tasks by priority (LOW/MEDIUM/HIGH)
- `GET /api/tasks/completed` - Get completed tasks
- `GET /api/tasks/overdue` - Get overdue tasks

## Sample Requests

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task
```json
POST /api/tasks
{
  "title": "Complete project",
  "description": "Finish the task manager API",
  "dueDate": "2026-03-15",
  "priority": "HIGH",
  "completed": false
}
```
