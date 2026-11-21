# 🚀 Deployment Guide: Online Book Store Monorepo

This repository is structured as a **Full-Stack Monorepo** containing:
- `frontend/`: React 19 (Vite + Material UI + Axios + React Router)
- `backend/`: Java 21 Spring Boot 3.4.x (REST API + Spring Security + JWT + JPA/Hibernate)
- `database/`: Database assets including MySQL `schema.sql` and portable SQLite `bookstore_db.sqlite` (for Turso)

---

## 1. Hosting Frontend on Vercel (Single Unified Project)

The repository root is pre-configured with `vercel.json` and root `package.json` so that you can import this entire GitHub repository into Vercel as **one single project**.

### Deploying via Vercel Dashboard:
1. Log into [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: `https://github.com/MajidLeghari/Online_Book-Store`.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: Leave as `./` (or select `frontend`)
   - **Build Command**: `cd frontend && npm install && npm run build` (handled automatically by `vercel.json`)
   - **Output Directory**: `frontend/dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The public URL of your deployed Spring Boot backend (e.g., `https://your-backend.up.railway.app/api`).
6. Click **Deploy**.

Vercel will build the frontend and serve it with clean SPA routing (no 404 on refresh).

---

## 2. Database Hosting Options

### Option A: Turso Cloud Database (Quick & Serverless)
A pre-seeded SQLite database file is included at:
`database/bookstore_db.sqlite`

You can upload this directly to Turso:
```bash
# 1. Install Turso CLI
winget install turso

# 2. Login
turso auth login

# 3. Create database directly from the file
turso db create bookstore-db --from-file database/bookstore_db.sqlite

# 4. View URL & generate auth token
turso db show bookstore-db --url
turso db tokens create bookstore-db
```

### Option B: Cloud MySQL (Railway / Aiven / PlanetScale)
1. Provision a free MySQL database instance on [Railway.app](https://railway.com) or [Aiven.io](https://aiven.io).
2. Run `database/schema.sql` to initialize tables and sample data (or allow Spring Boot Hibernate to auto-generate them).

---

## 3. Hosting the Spring Boot Backend

> **Note on Vercel**: Vercel is designed for serverless functions and static sites; it does not run persistent Java Virtual Machine (JVM) long-running processes. You can deploy the Spring Boot backend on a free/low-cost container platform:

### Deploying on Railway.app (Recommended):
1. Go to [railway.com](https://railway.com) and create a new project.
2. Choose **Deploy from GitHub repo** → select `MajidLeghari/Online_Book-Store`.
3. Set the **Root Directory** to `/backend`.
4. In the service variables, add:
   ```properties
   DB_URL=jdbc:mysql://${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}
   DB_USERNAME=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   server.port=8081
   ```
5. Copy the generated public domain (e.g. `https://online-bookstore-production.up.railway.app`) and set it as `VITE_API_BASE_URL` in your Vercel project!

### Deploying on Render.com:
1. Create a **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repository.
3. Choose **Docker** environment using `backend/Dockerfile`.
4. Provide the environment variables for database connection.

---

## 4. Local Deployment with Docker Compose

To run the complete full-stack environment locally with a single command:

```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8066/api`
- MySQL: `localhost:3306`
