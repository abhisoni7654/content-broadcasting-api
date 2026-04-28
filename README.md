# 📺 Content Broadcasting Backend API

A robust, production-ready Node.js and PostgreSQL backend designed to schedule, manage, and broadcast educational content to classroom displays. It features a deterministic, time-series rotation engine, strict Role-Based Access Control (RBAC), and a clean architectural design.

## ✨ Key Features

* **Mathematical Rotation Engine:** Utilizes modulo arithmetic against an epoch baseline to continuously resolve the active broadcast state per subject without cron jobs or background workers.
* **Role-Based Access Control (RBAC):** Strict separation of concerns between `Teacher` (upload/schedule) and `Principal` (review/approve) workflows.
* **Secure Binary Storage:** Stream-based parsing of `multipart/form-data` via Multer, with double-validation (MIME-type and extension) to prevent malicious payload injections.
* **Time-Windowed SQL Queries:** Highly optimized, raw parameterized SQL queries that filter content strictly by active `start_time` and `end_time` bounds.
* **Enterprise Security:** Stateless JWT authentication, bcrypt password hashing, and aggressive rate limiting to prevent brute-force and DDoS attacks.
* **Clean Architecture:** Strict unidirectional data flow (`Router → Middleware → Controller → Service → Model → Database`).

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** PostgreSQL (via `pg` connection pool)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **File Handling:** Multer
* **Security:** express-rate-limit, cors

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+ recommended)
* PostgreSQL running locally or remotely

### 1. Clone & Install
```bash
git clone https://github.com/abhisoni7654/content-broadcasting-api.git
cd content-broadcasting-api
npm install

2. Environment Variables

Create a .env file in the root directory and configure the following:
<img width="444" height="106" alt="image" src="https://github.com/user-attachments/assets/35ed9d18-0d10-4d29-8286-662438dd4319" />


PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=broadcasting_db

# Security
JWT_SECRET=your_jwt_key
JWT_EXPIRE=30d

3. Database Setup

Create the database and tables using the schema design provided in the project. You will need a users table and a content table with foreign key relations.
4. Run the Server
npm run dev

# Start the server
node server.js

📡 API Reference
Auth Routes (Rate Limited)

    POST /api/auth/register - Register a new Teacher or Principal

    POST /api/auth/login - Authenticate and receive JWT

Content Routes (Protected)

    POST /api/content/upload - Upload new content (Teacher only)

    GET /api/content/pending - View content awaiting approval (Principal only)

    PATCH /api/content/:id/review - Approve or reject content (Principal only)

Broadcast Routes (Public)

    GET /api/broadcast/live/:teacherId - Fetches the currently active content for a specific teacher's screen based on time and rotation logic.

🏗️ Folder Structure
Plaintext

src/
├── config/         # Database pool instantiation
├── controllers/    # I/O extraction and HTTP response formatting
├── middlewares/    # JWT guards, RBAC, Multer, Rate Limiting, Error Handling
├── models/         # Data Access Layer (Raw parameterized SQL)
├── routes/         # Express endpoint definitions
├── services/       # Core business logic and rotation algorithms
└── utils/          # Async wrappers
