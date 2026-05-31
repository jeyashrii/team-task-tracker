# Team Task Tracker API

REST API for managing team tasks with authentication, role-based access control, Redis caching, and Dockerized deployment.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Redis
- JWT
- Docker

## Running the Application

Clone the repository and run:

```
docker compose up --build
```

API runs on:

```
http://localhost:5000
```

To stop containers:

```
docker compose down
```

## Postman Collection

Import:

```
backend/team-task-tracker-collection.postman_collection.json

```

## Roles

### ADMIN

- Manage users
- Manage tasks
- Full access

### MANAGER

- Manage tasks
- Assign tasks
- Cannot manage users

### MEMBER

- View assigned tasks
- Update assigned task status

## Main Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh-token

### Users

- POST /api/users (Admin only)

### Tasks

- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/status

### Query Parameters

Task listing supports:

- `page`
- `limit`
- `status`
- `priority`
- `assignee`

## Database Design

### Collections

**User**

- name
- email
- password
- role

**Task**

- title
- description
- priority
- status
- assignee
- dueDate

### Indexes

Indexes added on:

- status
- assignee
- dueDate

### DB Design Decision

Tasks store a reference to the assigned user instead of embedding user data. This avoids duplication and keeps task documents small.

## Task Status Flow

```

TODO → IN_PROGRESS → IN_REVIEW → DONE
↘
BLOCKED

```

Status transitions are validated on the server.

## Redis Caching

Task list responses are cached.

Cache keys:

```

tasks:all
tasks:{assigneeId}

```

Cache is invalidated when:

- A task is created
- A task is updated
- A task is deleted
- A task status changes

## Error Response Format

```

{
"status": 400,
"code": "VALIDATION_ERROR",
"message": "Due date must be a future date"
}

```

## Future Improvements

If I had more time, I would

- Add frontend integration
- Add unit and integration tests
- Implement WebSocket notifications for task status updates.

## Repository Structure

```

backend/
├─ docker-compose.yml
├─ dockerfile
├─ package.json
├─ README.md
├─ team-task-tracker-collection.postman_collection.json
└─ src/
├─ app.js
├─ server.js
├─ config/
│ ├─ db.js
│ └─ redis.js
├─ controllers/
│ ├─ authController.js
│ ├─ taskController.js
│ └─ userController.js
├─ middleware/
│ ├─ authMiddleware.js
│ ├─ errorMiddleware.js
│ ├─ roleMiddleware.js
│ └─ taskStatusMiddleware.js
├─ models/
│ ├─ organizationModel.js
│ ├─ refreshTokenModel.js
│ ├─ taskModel.js
│ └─ userModel.js
└─ utils/
└─ AppError.js
```
