# Team Task Manager 🚀

A full-stack web application for managing projects, assigning tasks, and tracking progress with role-based access control (Admin/Member).

🔗 **Live Demo:** [team-task-manager-production-99b2.up.railway.app](https://team-task-manager-production-99b2.up.railway.app)  
📦 **GitHub:** [github.com/vaibhavk149/team-task-manager](https://github.com/vaibhavk149/team-task-manager)

---

## ✨ Features

- **Authentication** — Signup & Login with JWT, password hashing (bcrypt), show/hide password toggle, confirm password validation
- **Role-Based Access** — Admin and Member roles with granular permissions
- **Project Management** — Create, update, delete projects (Admin). Add/remove team members by email
- **Task Management** — Create tasks with title, description, priority (low/medium/high), due dates. Assign tasks to team members
- **Status Tracking** — Track task status: Pending → In Progress → Done. Members can update their own task status
- **Interactive Dashboard** — Clickable stat cards (Projects, Members, Tasks, Pending, Completed) that navigate to relevant pages or open detail modals
- **Team Management** — View all members modal from dashboard, remove members with confirmation dialog, automatic cleanup of project memberships & task assignments
- **Visual Analytics** — Pie chart for task status distribution, bar chart for project progress, overdue alerts, upcoming deadlines
- **Premium UI** — Modern glassmorphism design with Tailwind CSS, Framer Motion animations, and Geist font

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **Deployment** | Railway |

---

## 📁 Project Structure

```
Team Task Manager/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Reusable UI components
│   │   │   ├── landing/     # Landing page sections
│   │   │   └── ui/          # Button, Logo, etc.
│   │   ├── context/         # AuthContext (React Context API)
│   │   ├── pages/           # All page components
│   │   └── lib/             # Utility functions
│   └── index.html
│
├── server/                  # Express Backend
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth & Role-check middleware
│   ├── models/              # Mongoose schemas (User, Project, Task)
│   └── routes/              # API route definitions
│
└── README.md
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Login & get JWT token | Public |
| GET | `/api/auth/me` | Get current user profile | Authenticated |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | Get all user's projects | Authenticated |
| GET | `/api/projects/:id` | Get single project | Authenticated |
| POST | `/api/projects` | Create a project | Admin |
| PUT | `/api/projects/:id` | Update a project | Admin |
| DELETE | `/api/projects/:id` | Delete project + tasks | Admin |
| POST | `/api/projects/:id/members` | Add member by email | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member from project | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks/my-tasks` | Get tasks assigned to me | Authenticated |
| GET | `/api/tasks/admin-all` | Get all tasks (admin's projects) | Admin |
| GET | `/api/tasks/project/:projectId` | Get tasks by project | Authenticated |
| GET | `/api/tasks/:id` | Get single task | Authenticated |
| POST | `/api/tasks` | Create a task | Admin |
| PUT | `/api/tasks/:id` | Update a task | Admin |
| PATCH | `/api/tasks/:id/status` | Update task status | Assignee/Admin |
| DELETE | `/api/tasks/:id` | Delete a task | Admin |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| DELETE | `/api/users/:id` | Delete user from system | Admin |

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/vaibhavk149/team-task-manager.git
cd team-task-manager
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 👥 Roles & Permissions

| Action | Admin | Member |
|--------|-------|--------|
| Create/Edit/Delete Projects | ✅ | ❌ |
| Add/Remove Team Members (per project) | ✅ | ❌ |
| Remove Members from System | ✅ | ❌ |
| Create/Delete Tasks | ✅ | ❌ |
| Assign Tasks | ✅ | ❌ |
| Update Own Task Status | ✅ | ✅ |
| View Assigned Tasks | ✅ | ✅ |
| View Dashboard & Analytics | ✅ | ✅ |
| Clickable Dashboard Stats | ✅ | ✅ |

---

## 📊 Dashboard Features

### Admin Dashboard
- **Total Projects** card → Clicks through to Projects page
- **Total Members** card → Opens modal with full member list + remove option
- **Total Tasks** card → Clicks through to Tasks page
- **Pending / Completed** cards → Clicks through to Tasks page
- **Charts** — Task status pie chart, project progress bar chart
- **Alerts** — Overdue tasks, upcoming deadlines (next 3 days)

### Member Dashboard
- **Total Tasks / Pending / Completed** cards → Clicks through to Tasks page
- **Productivity Overview** — Completion rate, upcoming deadlines
- **Alerts** — Overdue tasks, upcoming deadlines

---

## 📝 License

This project is built as part of a placement assignment.
