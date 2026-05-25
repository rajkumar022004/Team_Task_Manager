# Production Checklist

## MongoDB Atlas

- [ ] Cluster created and running
- [ ] Database user created with strong password
- [ ] Network access allows `0.0.0.0/0` (or Railway static IPs if configured)
- [ ] `MONGODB_URI` uses `mongodb+srv://` (not `mongodb://127.0.0.1`)
- [ ] Database name included in connection string

## Railway (Backend)

- [ ] Repo connected; root directory is project root (not `client`)
- [ ] `npm start` runs `node server.js`
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` set to Atlas connection string
- [ ] `JWT_SECRET` set to a strong random value
- [ ] `JWT_EXPIRE` set (e.g. `7d`)
- [ ] `CLIENT_URL` set to Vercel production URL (and preview URLs if needed)
- [ ] `GET /api/health` returns `{"success":true}`
- [ ] Logs show `MongoDB connected` and `Server running`

## Vercel (Frontend)

- [ ] Root directory set to `client`
- [ ] `VITE_API_URL=https://<railway-host>/api` (with `/api`, no trailing slash)
- [ ] Production rebuild after env var changes
- [ ] `vercel.json` SPA rewrites in place (client folder)
- [ ] Login/signup reach Railway (check browser Network tab)

## Security

- [ ] `.env` not committed (in `.gitignore`)
- [ ] `JWT_SECRET` not shared or committed
- [ ] Atlas user has least-privilege access
- [ ] Production uses HTTPS only (Railway + Vercel default)

## Functional smoke test (production)

- [ ] Sign up new user
- [ ] Log in
- [ ] Dashboard stats load
- [ ] Projects list loads (admin: create project)
- [ ] Tasks list loads (admin: create task)
- [ ] Log out and protected routes redirect to login
- [ ] Invalid token returns 401 and clears session

## Common misconfigurations

- [ ] `VITE_API_URL` is **not** `https://railway.app/api/api`
- [ ] `VITE_API_URL` is **not** missing `/api` suffix
- [ ] `CLIENT_URL` matches browser address bar origin exactly
- [ ] Railway service is not pointing at `client/` folder
