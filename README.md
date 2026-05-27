# Worksync — Team Task Management Platform

Worksync is a full-stack productivity platform built for structured team collaboration. It implements a strict **Workspace → Team → Task** hierarchy, enabling organizations to clearly organize their work, enforce access control, and maintain end-to-end project visibility.

Built with the **MERN stack**, Worksync is designed to feel and operate like a professional SaaS product — not a CRUD prototype.

---

## ✨ Key Features

### Workspace Management
- Admins create and manage **Workspaces** (Projects) with member assignment
- Each workspace has an **Overview dashboard** showing teams, recent tasks, and member snapshots
- Role-Based Access Control (RBAC) ensures only authorized users can modify workspaces

### Team Hierarchy
- Workspaces contain **Teams**, allowing multi-team structures within a single project
- Teams have individual member rosters, task ownership, and navigation context
- Team dashboards surface active tasks and member stats in real time

### Task System
- Tasks are scoped to a **Team** within a **Workspace** — enforcing structural integrity
- Admins create and assign tasks; members can update task status (`TODO → IN_PROGRESS → DONE`)
- Global task view supports filtering by Workspace, Team, and Status
- Tasks surface overdue indicators and team context throughout the UI

### Dashboard
- Global dashboard aggregates across all workspaces and teams
- Role-aware: Admins see full ecosystem; Members see their scoped view
- **Active Workspaces** and **Active Teams** panels provide one-click navigation
- Skeleton loading states prevent layout shifts

### RBAC & Security
- JWT-based authentication via HTTP-only cookies + Authorization headers
- Two roles: `ADMIN` (full control) and `MEMBER` (scoped view and status updates only)
- All API endpoints protected by `authMiddleware` and `roleMiddleware`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router v6, React Hook Form, Zod |
| Styling | Tailwind CSS v4, Inter Font, custom design tokens |
| HTTP Client | Axios with request/response interceptors |
| Notifications | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT, bcryptjs, HTTP-only cookies |
| Validation | express-validator |
| Security | Helmet, CORS |

---

## 📁 Architecture

The application follows a clean **Controller → Service → Model** pattern with strict separation of concerns.

```
worksync/
├── backend/
│   └── src/
│       ├── config/         # Database & environment config
│       ├── constants/      # Centralized enums (ROLES, STATUS, PRIORITY)
│       ├── controllers/    # Thin request/response handlers
│       ├── middlewares/    # Auth, Role, Validation, Error handlers
│       ├── models/         # Mongoose schemas (User, Project, Team, Task)
│       ├── routes/         # Express route definitions
│       ├── services/       # Business logic & database interactions
│       ├── utils/          # ApiError, asyncHandler wrappers
│       ├── app.js          # Express app setup, CORS, middleware
│       └── server.js       # Server entry point
│
└── frontend/
    └── src/
        ├── api/            # Axios instance with interceptors
        ├── components/     # Reusable UI (Cards, Forms, Badges, Managers)
        ├── constants/      # Frontend enums matching backend
        ├── context/        # AuthContext (user session management)
        ├── layouts/        # DashboardLayout (sidebar + shell)
        ├── pages/          # Route-level views
        │   ├── auth/       # LoginPage, SignupPage
        │   ├── dashboard/  # DashboardPage
        │   ├── projects/   # ProjectsPage, ProjectDetailPage,
        │   │               # ProjectTeamsPage, TeamDetailPage
        │   └── tasks/      # TasksPage, TaskDetailPage
        └── routes/         # Protected & Public route guards
```

### Data Hierarchy
```
Workspace (Project)
  └── Team
        ├── Members (Users)
        └── Tasks (scoped to this Team)
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone the repository
```bash
git clone https://github.com/Satyendra0007/worksync.git
cd worksync
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env
# Edit .env with your values
npm run dev
```

Backend runs on `http://localhost:5000`.

**Required environment variables** (see `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/worksync
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env
# Edit .env with your values
npm run dev
```

Frontend runs on `http://localhost:5173`.

**Required environment variables** (see `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 API Reference

### Auth
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user (default role: MEMBER) | Public |
| POST | `/api/auth/login` | Authenticate and receive JWT cookie | Public |
| POST | `/api/auth/logout` | Clear auth session | Protected |
| GET | `/api/auth/me` | Get current user profile | Protected |

### Workspaces (Projects)
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/projects` | List accessible workspaces | Protected |
| POST | `/api/projects` | Create a workspace | Admin |
| GET | `/api/projects/:id` | Get workspace details | Member/Admin |
| POST | `/api/projects/:id/members` | Add member to workspace | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | Admin |

### Teams
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/projects/:id/teams` | List teams in workspace | Member/Admin |
| POST | `/api/projects/:id/teams` | Create a team | Admin |
| GET | `/api/projects/:id/teams/:teamId` | Get team details | Member/Admin |
| PATCH | `/api/projects/:id/teams/:teamId` | Update team | Admin |
| DELETE | `/api/projects/:id/teams/:teamId` | Delete team | Admin |
| POST | `/api/projects/:id/teams/:teamId/members` | Add team member | Admin |
| DELETE | `/api/projects/:id/teams/:teamId/members/:userId` | Remove team member | Admin |

### Tasks
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/tasks` | List tasks (role-scoped) | Protected |
| POST | `/api/tasks` | Create a task | Admin |
| GET | `/api/tasks/:id` | Get task details | Team Member/Admin |
| PATCH | `/api/tasks/:id` | Update task (status for Members, full for Admin) | Assignee/Admin |
| DELETE | `/api/tasks/:id` | Delete a task | Admin |

### Dashboard
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/api/dashboard` | Aggregated workspace stats | Protected |

---

## 🔐 RBAC Summary

| Action | Admin | Member |
|---|---|---|
| Create/delete workspace | ✅ | ❌ |
| Manage workspace members | ✅ | ❌ |
| Create/delete teams | ✅ | ❌ |
| Manage team members | ✅ | ❌ |
| Create/delete tasks | ✅ | ❌ |
| View workspace & team tasks | ✅ | ✅ (scoped to their teams) |
| Update task status | ✅ | ✅ (assignee only) |

---

*Worksync — Structured team productivity, built right.*
