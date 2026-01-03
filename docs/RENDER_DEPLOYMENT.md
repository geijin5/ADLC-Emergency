# Deploying to Render

This guide explains how to deploy the ADLC Emergency Services platform to Render.

## Overview

Render is a cloud platform that can host:
- Backend API (NestJS)
- Frontend Web App (React)
- PostgreSQL Database

## Prerequisites

1. Render account (sign up at https://render.com)
2. GitHub repository with your code
3. Environment variables ready

## Step 1: Prepare Your Repository

Ensure your repository has:
- `render.yaml` (already created)
- All code pushed to GitHub
- Environment variables documented

## Step 2: Create Render Services

### Option A: Using render.yaml (Recommended)

1. Go to Render Dashboard → New → Blueprint
2. Connect your GitHub repository
3. Select the repository
4. Render will automatically detect `render.yaml`
5. Review services and click "Apply"

### Option B: Manual Setup

#### Create PostgreSQL Database

1. **New → PostgreSQL**
   - Name: `adlc-database`
   - Database: `adlc_emergency`
   - User: `adlc_user`
   - Plan: Free (or Starter for production)
   - Region: Choose closest to you
   - Click "Create Database"
   - **Save the Internal Database URL** (you'll need this)

#### Create Backend Service

1. **New → Web Service**
   - Connect your GitHub repository
   - Name: `adlc-backend`
   - Region: Same as database
   - Branch: `main` or `master`
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Plan: Free or Starter

2. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<from PostgreSQL service>
   JWT_SECRET=<generate a secure random string>
   JWT_EXPIRES_IN=24h
   MAPBOX_ACCESS_TOKEN=<your-mapbox-token>
   CORS_ORIGIN=https://adlc-emergency.onrender.com,https://adlc-frontend.onrender.com
   WS_PORT=10000
   ```

3. Click "Create Web Service"

#### Create Frontend Service

1. **New → Static Site** (or Web Service)
   - Connect your GitHub repository
   - Name: `adlc-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Plan: Free or Starter

2. **Environment Variables:**
   ```
   VITE_API_URL=https://adlc-backend.onrender.com
   VITE_MAPBOX_TOKEN=<your-mapbox-token>
   VITE_WS_URL=wss://adlc-backend.onrender.com
   ```

3. Click "Create Static Site"

## Step 3: Update Environment Variables

After creating services, update:

1. **Frontend CORS_ORIGIN** in backend service:
   - Use the actual frontend URL from Render
   - Format: `https://adlc-frontend.onrender.com`

2. **Frontend VITE_API_URL**:
   - Use the actual backend URL from Render
   - Format: `https://adlc-backend.onrender.com`

3. **Frontend VITE_WS_URL**:
   - Use `wss://` (secure WebSocket)
   - Format: `wss://adlc-backend.onrender.com`

## Step 4: Run Database Migrations

After backend is deployed:

### Option A: Using Render Shell

1. Go to your backend service
2. Click "Shell" tab
3. Run:
   ```bash
   npm run migration:run
   ```

### Option B: Using Local Connection

1. Get your database connection string from Render
2. Temporarily add to local `.env`
3. Run migrations locally:
   ```bash
   cd backend
   npm run migration:run
   ```

### Option C: Using Render One-Off Job

1. Create a new One-Off Job
2. Command: `cd backend && npm run migration:run`
3. Attach to database service
4. Run the job

## Step 5: Create Admin User

After migrations are complete:

1. Use Render Shell or connect to database directly
2. Create admin user (see SETUP.md for SQL)

## Step 6: Verify Deployment

1. **Backend Health Check:**
   ```
   https://adlc-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok","database":"connected"}`

2. **Frontend:**
   ```
   https://adlc-frontend.onrender.com
   ```

3. **Test API:**
   ```
   https://adlc-backend.onrender.com/api/alerts/public
   ```

## Step 7: Custom Domains (Optional)

### Backend Custom Domain

1. Go to backend service → Settings → Custom Domains
2. Add your domain
3. Follow DNS instructions

### Frontend Custom Domain

1. Go to frontend service → Settings → Custom Domains
2. Add your domain
3. Follow DNS instructions
4. Update CORS_ORIGIN in backend to include new domain

## Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<from Render PostgreSQL>
JWT_SECRET=<secure-random-string>
JWT_EXPIRES_IN=24h
MAPBOX_ACCESS_TOKEN=<your-token>
CORS_ORIGIN=https://adlc-frontend.onrender.com
WS_PORT=10000
```

### Frontend (.env)
```env
VITE_API_URL=https://adlc-backend.onrender.com
VITE_MAPBOX_TOKEN=<your-token>
VITE_WS_URL=wss://adlc-backend.onrender.com
```

## Troubleshooting

### Backend Won't Start

1. Check logs in Render dashboard
2. Verify DATABASE_URL is correct
3. Ensure PORT is set to 10000
4. Check that all environment variables are set

### Database Connection Failed

1. Verify DATABASE_URL uses internal hostname
2. Check security group allows connections
3. Ensure database is running
4. Verify credentials are correct

### Frontend Can't Connect to Backend

1. Check CORS_ORIGIN includes frontend URL
2. Verify VITE_API_URL is correct
3. Ensure backend is deployed and healthy
4. Check browser console for errors

### WebSocket Not Working

1. Verify VITE_WS_URL uses `wss://` (not `ws://`)
2. Check backend WebSocket gateway configuration
3. Ensure CORS allows WebSocket connections

### Migrations Fail

1. Check DATABASE_URL is accessible
2. Verify user has CREATE privileges
3. Check migration files are in repository
4. Review error logs

## Render-Specific Considerations

### Free Tier Limitations

- Services sleep after 15 minutes of inactivity (Free tier)
- Database has size limitations
- Consider upgrading to Starter plan for production

### Auto-Deploy

Render automatically deploys on:
- Push to connected branch (default: main/master)
- Manual deploy button

### Logs

- View logs in Render dashboard
- Real-time log streaming available
- Log retention depends on plan

### SSL/HTTPS

- Automatically enabled for all services
- Custom domains get SSL certificates automatically
- No additional configuration needed

## Continuous Deployment

### GitHub Actions Integration

The included `.github/workflows/render-deploy.yml` can automate deployments.

1. Add Render API key to GitHub Secrets:
   - `RENDER_API_KEY`: Get from Render → Account Settings → API Keys
   - `RENDER_SERVICE_ID`: Found in service settings

2. Workflow will auto-deploy on push to main

### Manual Deployment

1. Go to service in Render dashboard
2. Click "Manual Deploy"
3. Select branch/commit
4. Deploy

## Monitoring

### Health Checks

Render automatically checks:
- `GET /api/health` endpoint
- Service responds within timeout

### Alerts

Set up alerts in Render:
1. Service → Alerts
2. Configure email/Slack notifications
3. Set thresholds

## Cost Optimization

1. **Free Tier:**
   - Good for development/testing
   - Services sleep after inactivity
   - Limited resources

2. **Starter Plan ($7/month per service):**
   - Always on
   - Better performance
   - Recommended for production

3. **Database:**
   - Free tier: 90 days, 1 GB
   - Starter: $7/month, 256 GB

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domains
3. Set up automated backups
4. Review security settings
5. Consider upgrading plans for production

