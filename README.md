# InternBridge - Student & Business Project Matching Platform

A full-stack project discovery and team matching platform connecting college students and student squads with businesses for practical engineering briefs.

---

## 📁 Repository Structure

```
internbridge/
├── frontend/                  # React 19 + Vite 8 + Tailwind CSS v4 Frontend
│   ├── src/                   # Components, pages, context, and UI primitives
│   ├── package.json           # Frontend dependencies & scripts
│   ├── vite.config.js         # Configured with proxy to http://localhost:5000
│   └── index.html             # Application HTML shell
│
├── backend/                   # Node.js + Express + MongoDB REST API Backend
│   ├── config/                # Mongoose database connection
│   ├── models/                # User, StudentProfile, BusinessProfile, Project, Team, Application
│   ├── controllers/           # Auth, Project, Team, Application, Student controllers
│   ├── routes/                # Express API routes (/api/*)
│   ├── middlewares/           # JWT auth and RBAC (Student / Business / Admin)
│   ├── services/              # Server-side matching algorithm & scoring engine
│   ├── seed.js                # Database seeder script
│   ├── .env                   # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   └── package.json           # Backend dependencies & scripts
│
└── package.json               # Root monorepo script runner
```

---

## ⚡ Quick Start

### 1. Install All Dependencies
From the repository root:
```bash
npm run install:all
```
*(Or install individually inside `frontend/` and `backend/`)*

### 2. Configure MongoDB & Seed (Backend)
Ensure MongoDB is running locally (`mongodb://localhost:27017`) or configure `MONGO_URI` in `backend/.env`.

Populate initial test accounts, student profiles, briefs, and squads:
```bash
npm run seed
```
> **Default Test Credentials** (Password for all: `password123`):
> - **Student 1**: `rohan.verma@college.edu`
> - **Student 2**: `ananya.sharma@college.edu`
> - **Business**: `contact@techretail.in`
> - **Admin**: `admin@internbridge.in`

### 3. Run the Applications

You can run both or either from the root directory or inside their folders:

#### From Repository Root:
```bash
# Start Frontend (http://localhost:3000)
npm run dev

# Start Backend (http://localhost:5000 with auto-reload)
npm run dev:backend
```

#### Or Run Individually:
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```
