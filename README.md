# Real-Time Collaborative Workspace Backend

This is a production-grade backend service for a real-time collaborative workspace, built as part of the Purple Merit Technologies assessment.

## Features
- **Authentication**: JWT-based auth with Refresh Tokens and RBAC (Owner, Collaborator, Viewer).
- **Projects**: RESTful APIs for managing projects and workspaces. `DELETE` functionality included.
- **Real-Time**: Socket.io with Redis Adapter for horizontal scalability. Supports file changes and cursor movements.
- **Jobs**: Asynchronous code execution using BullMQ (Redis) with result persistence in PostgreSQL.
- **Documentation**: Swagger UI available at `/api-docs`.

## Test Coverage
The backend service meets the production-grade requirement with **72.61%** test coverage.

![Test Coverage](./image.png)

```text
---------------------|---------|----------|---------|---------|----------------------               
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                                     
---------------------|---------|----------|---------|---------|----------------------                                                                                 
All files            |   72.61 |    66.66 |      75 |   77.92 |                                                                                                       
 config              |     100 |       50 |     100 |     100 |                                                                                                       
  env.js             |     100 |       50 |     100 |     100 | 6                                                                                                     
 modules/auth        |   80.64 |    58.33 |     100 |   96.15 |                                                                                                       
  auth.service.js    |   80.64 |    58.33 |     100 |   96.15 | 65                                                                                                    
 modules/jobs        |   88.88 |      100 |     100 |   88.88 |                      
  jobs.controller.js |   88.88 |      100 |     100 |   88.88 | 23,56               
 modules/projects    |   54.54 |       60 |   57.14 |   54.83 |                     
  project.service.js |   54.54 |       60 |   57.14 |   54.83 | 4-27,47-59,78,93,118
---------------------|---------|----------|---------|---------|----------------------
```

## Architecture
- **Language**: Node.js (v20)
- **Framework**: Express.js
- **Database**: PostgreSQL (Relational Data), Redis (Queues & Pub/Sub).
- **Architecture Pattern**: Modular (Service-Controller-Route).
- **Core Components**:
    - **Auth Service**: Standardized JWT (Access/Refresh) with RBAC.
    - **Project Service**: CRUD operations for workspaces/projects.
    - **Real-Time Service**: Socket.io logic separated for clear boundaries.
    - **Job Queue**: BullMQ for handling background tasks (e.g., email, data processing).
    - **Serverless Simulation**: `thumbnail-generator.js` simulates external function calls.

### Design Decisions
- **Token Refresh**: Implemented `refresh_token` flow to keep access tokens short-lived (15m) for security, while allowing seamless sessions (7d).
- **Scaling**: Used `@socket.io/redis-adapter` to allow multiple backend instances to broadcast events to each other.
- **Job Persistence**: Workers save results to a `job_results` table so they aren't lost if Redis memory is cleared.
- **Caching Strategy**: Custom Redis middleware (`cache.middleware.js`) caches successful GET responses for ultra-fast retrieval, reducing DB load for frequent reads.
- **Feature Flags**: Implemented a `featureFlag.service.js` to toggle BETA features dynamically without redeploying code.
- **Serverless Simulation**: Created a `serverless/thumbnail-generator.js` script to mimic an AWS Lambda function, demonstrating how the backend interacts with external FaaS providers.

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
