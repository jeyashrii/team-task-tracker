# Team Task Tracker API

## SDE II Take-Home Assignment

This is the backend for a simple team task tracker built as part of an SDE II take-home assignment.
It includes authentication, role-based authorization, task management, Redis caching, and a Docker-based setup so the reviewer can run it with `docker compose up`.

## What this does

The API is designed around teams and organizations. It lets users:

- sign up and log in with JWT access + refresh tokens
- manage tasks with permissions for `ADMIN`, `MANAGER`, and `MEMBER`
- track tasks with priorities, assignees, and due dates
- enforce task status transitions on the server
- cache task list results in Redis

## What I implemented

### Authentication & Authorization

- `POST /api/auth/register` creates a new organization and admin user
- `POST /api/auth/login` issues access and refresh tokens
- `POST /api/auth/refresh-token` rotates refresh tokens
- middleware handles RBAC cleanly, keeping permission checks out of controller code

### Roles & Permissions

- `ADMIN`: full access, including creating users and deleting tasks
- `MANAGER`: can create and update tasks, and change task status
- `MEMBER`: can view tasks and change status only for tasks assigned to them

### Task management

A task includes:

- `title` (required)
- `description`
- `priority` (`LOW`, `MEDIUM`, `HIGH`)
- `status` (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED`)
- `assignee` (user reference)
- `dueDate`

Status transitions are restricted so you can only move tasks along:

- `TODO -> IN_PROGRESS -> IN_REVIEW -> DONE`
- `BLOCKED` from any active state

And only the assigned user or a `MANAGER` can update a task’s status.

### Task listing

The `GET /api/tasks` endpoint supports:

- pagination using `page` and `limit`
- filtering by `status`, `priority`, and `assignee`

### Database design

Tasks are stored in MongoDB. I added indexes on:

- `status`
- `assignee`
- `dueDate`

These are the fields most frequently used for filtering and should make the task list queries faster.

## Setup

Create a `.env` file in `backend/` with:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/tasktracker
REDIS_URL=redis://redis:6379
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Then run:

```bash
cd backend
docker compose up --build
```

The API will be available at `http://localhost:5000`.

If you want to run it locally without Docker:

```bash
cd backend
npm install
npm run dev
```

## Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`

### Users

- `POST /api/users` (ADMIN only)

### Tasks

- `POST /api/tasks` (ADMIN, MANAGER)
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id` (ADMIN, MANAGER)
- `DELETE /api/tasks/:id` (ADMIN)
- `PATCH /api/tasks/:id/status` (assignee or MANAGER)

## Redis caching

Task list results are cached with keys like:

- `tasks:all`
- `tasks:{assignee}`

The cache is invalidated whenever a task changes:

- create task
- update task
- delete task
- update task status

That way the task lists stay fresh without doing extra database work for every request.

## Design note

I picked separate indexes on `status`, `assignee`, and `dueDate` because those are the query fields used by the task list endpoint.
This is a simple way to speed up the most common task lookups without adding unnecessary complexity.

## What I would improve next

- add organization scoping so tasks are always returned only for the user’s org
- add automated tests for auth, RBAC, and status transitions
- add an OpenAPI/Swagger spec for the API
- build a lightweight frontend task board
- add more validation and better error messages for edge cases

## Notes

- error responses use the common format from `src/utils/AppError.js`
- RBAC is enforced in middleware, not inside controllers
- Redis is used for caching task list queries, MongoDB is the primary datastore
