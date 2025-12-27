# Real-Time Collaborative Workspace Backend

This is a production-grade backend service for a real-time collaborative workspace, built as part of the Purple Merit Technologies assessment.

## Features
- **Authentication**: JWT-based auth with Refresh Tokens and RBAC (Owner, Collaborator, Viewer).
- **Projects**: RESTful APIs for managing projects and workspaces. `DELETE` functionality included.
- **Real-Time**: Socket.io with Redis Adapter for horizontal scalability. Supports file changes and cursor movements.
- **Jobs**: Asynchronous code execution using BullMQ (Redis) with result persistence in PostgreSQL.
- **Documentation**: Swagger UI available at `/api-docs`.

## Architecture
- **Language**: Node.js (v20)
- **Framework**: Express.js
- **Database**: PostgreSQL (Relational Data), Redis (Queues & Pub/Sub).
- **Architecture Pattern**: Modular (Service-Controller-Route).

### Design Decisions
- **Token Refresh**: Implemented `refresh_token` flow to keep access tokens short-lived (15m) for security, while allowing seamless sessions (7d).
- **Scaling**: Used `@socket.io/redis-adapter` to allow multiple backend instances to broadcast events to each other.
- **Job Persistence**: Workers save results to a `job_results` table so they aren't lost if Redis memory is cleared.

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL
- Redis
- Docker (optional)

### Local Setup (Manual)
1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file in `backend/` based on `config/env.js`.
    ```env
    PORT=3000
    DATABASE_URL=postgresql://user:pass@localhost:5432/collab_workspace
    JWT_SECRET=supersecret
    REDIS_URL=redis://localhost:6379
    ```
3.  **Run Dev Server**:
    ```bash
    npm run dev
    ```
4.  **Run Tests**:
    ```bash
    npm test
    ```

### Docker Setup
1.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```
    This spins up Backend, Postgres, and Redis containers.

## API Documentation
Once running, verify the APIs at:
**http://localhost:3000/api-docs**

## Testing
Unit tests are implemented using **Jest**.
Run via `npm test`.
