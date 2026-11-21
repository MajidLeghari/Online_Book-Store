# Deployment Guide: Online Book Store Monorepo

This repository is structured as a **Full-Stack Monorepo** containing:
- `frontend/`: React 19 (Vite + Material UI + Axios + React Router)
- `backend/`: Java 21 Spring Boot 3.4.3 (REST API + Spring Security + JWT + JPA/Hibernate)
- `database/`: MySQL 8/9 initialization scripts and schema (`schema.sql`)

---

## 1. Hosting Frontend on Vercel

Vercel is specifically designed for frontend SPAs and Edge runtimes. This monorepo is already pre-configured with root and nested `vercel.json` files for automatic single-page routing (preventing 404s when navigating or refreshing `/register`, `/books`, `/cart`, etc.).

### Deploying via Vercel Dashboard:
1. Log into [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: `https://github.com/MajidLeghari/Online_Book-Store`.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `frontend` (or keep `./` as root because root `package.json` and `vercel.json` are pre-configured).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The public URL of your deployed Spring Boot backend (e.g. `https://your-backend.up.railway.app/api`).
6. Click **Deploy**.

---

## 2. Hosting the Spring Boot Backend

> **Note on Vercel**: Vercel does not run persistent Java virtual machines (JVM / Spring Boot processes). To run the Spring Boot API, you can host it for free/low-cost on modern container platforms:

### Option A: Railway.app (Recommended)
1. Go to [railway.com](https://railway.com) and create a new project.
2. Choose **Deploy from GitHub repo** → select `MajidLeghari/Online_Book-Store`.
3. Set the **Root Directory** to `/backend`.
4. Add Railway MySQL service in the same project.
5. In the backend service environment variables, configure:
   ```properties
   spring.datasource.url=jdbc:mysql://${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}
   spring.datasource.username=${{MYSQLUSER}}
   spring.datasource.password=${{MYSQLPASSWORD}}
   server.port=8066
   ```

### Option B: Render.com
1. Create a **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repository.
3. Choose **Docker** environment using `backend/Dockerfile`.
4. Attach a managed MySQL database and link environment variables.

---

## 3. Hosting the MySQL Database

1. **Aiven / PlanetScale / Railway**:
   - Create a free cloud MySQL instance.
   - Run the SQL file in `database/schema.sql` to initialize tables and initial seed data.
2. Configure your Spring Boot backend's `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` to point to your hosted database.

---

## 4. Local Deployment with Docker Compose

To run the complete full-stack environment locally with a single command:

```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8066/api`
- MySQL: `localhost:3306`
