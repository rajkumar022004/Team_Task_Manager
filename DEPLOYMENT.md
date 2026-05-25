# Deployment Guide — Team Task Manager

Stack: **Railway** (backend) · **Vercel** (frontend) · **MongoDB Atlas** (database)

---

## 1. MongoDB Atlas

1. Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. **Database Access** → create a database user with password.
3. **Network Access** → add `0.0.0.0/0` (allow from anywhere) so Railway can connect.
4. **Connect** → Drivers → copy the connection string.
5. Replace `<password>` with your user password and set the database name if needed:

```
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

---

## 2. Railway (Backend)

### Project settings

| Setting | Value |
|--------|--------|
| **Root Directory** | *(repo root — leave empty)* |
| **Start Command** | `npm start` |
| **Build Command** | `npm install` |

### Environment variables

| Variable | Example / notes |
|----------|-----------------|
| `PORT` | Railway sets this automatically — do not override unless needed |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your Atlas `mongodb+srv://...` connection string |
| `JWT_SECRET` | Long random string (32+ characters) |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | Your Vercel URL, e.g. `https://your-app.vercel.app` |

For multiple frontends (preview + production), use comma-separated URLs:

```
https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

### Deploy

1. Connect the GitHub repo to Railway.
2. Add the variables above.
3. Deploy and copy the public URL, e.g. `https://team-task-manager-production.up.railway.app`.

### Verify backend

```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/api/health
```

Expected:

```json
{"success":true}
```

---

## 3. Vercel (Frontend)

### Project settings

| Setting | Value |
|--------|--------|
| **Root Directory** | `client` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Environment variables

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` |

**Important:** Include the `/api` suffix. Do **not** add paths like `/api/auth/login` here — the app adds route paths on top of the base URL.

### Deploy

1. Import the repo in Vercel.
2. Set root directory to `client`.
3. Add `VITE_API_URL` (must be set **before** build).
4. Deploy.

### Update Railway CORS

After Vercel deploys, set `CLIENT_URL` on Railway to your exact Vercel URL and redeploy the backend.

---

## 4. Local development

### Backend (repo root)

```bash
cp .env.example .env
# Fill MONGODB_URI (Atlas or local), JWT_SECRET, etc.
npm install
npm run dev
```

### Frontend (`client/`)

```bash
cd client
cp .env.example .env
# VITE_API_URL=/api uses Vite proxy to http://127.0.0.1:5000
npm install
npm run dev
```

---

## 5. API route map

All routes are prefixed with `/api` on the server:

| Method | Path |
|--------|------|
| GET | `/api/health` |
| POST | `/api/auth/signup` |
| POST | `/api/auth/login` |
| GET | `/api/projects` |
| POST | `/api/projects` |
| GET | `/api/projects/:id` |
| PUT | `/api/projects/:id/members` |
| GET | `/api/tasks` |
| POST | `/api/tasks` |
| PUT | `/api/tasks/:id` |
| DELETE | `/api/tasks/:id` |
| GET | `/api/dashboard/stats` |
| GET | `/api/users/members` |

Frontend axios calls use paths **without** the `/api` prefix (e.g. `/auth/login`) because `VITE_API_URL` already ends with `/api`.

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Railway crash on start | Check `MONGODB_URI` and `JWT_SECRET` are set |
| MongoDB connection timeout | Atlas IP whitelist `0.0.0.0/0`; verify password in URI |
| Frontend “Resource not found” | Set `VITE_API_URL` to Railway URL **with** `/api`; rebuild Vercel |
| CORS errors | Set `CLIENT_URL` on Railway to exact Vercel origin (no trailing slash) |
| Double `/api/api` in URL | Set `VITE_API_URL` to `https://...railway.app/api` only once |
