# Deployment Guide

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Mapbox account and API key
- (Optional) Redis for caching
- (Optional) Twilio account for SMS notifications
- (Optional) SMTP server for email notifications

## Backend Deployment

### 1. Database Setup

**Option A: Local PostgreSQL**
```bash
# Create PostgreSQL database
createdb adlc_emergency

# Run migrations
cd backend
npm run migration:run
```

**Option B: AWS RDS PostgreSQL (Recommended for Production)**
See `docs/AWS_RDS_SETUP.md` for detailed instructions on setting up AWS RDS.

Quick setup:
1. Create RDS PostgreSQL instance in AWS Console
2. Note the endpoint, username, password
3. Update `DATABASE_URL` in `backend/.env`:
   ```
   DATABASE_URL=postgresql://username:password@your-rds-endpoint.region.rds.amazonaws.com:5432/adlc_emergency
   ```
4. Configure security groups to allow connection
5. Run migrations: `npm run migration:run`

### 2. Environment Configuration

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/adlc_emergency
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=production
MAPBOX_ACCESS_TOKEN=your-mapbox-token
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Build and Start

```bash
cd backend
npm install
npm run build
npm run start:prod
```

### 4. Production Recommendations

- Use PM2 or systemd for process management
- Set up reverse proxy (nginx) with SSL
- Configure firewall rules
- Set up database backups
- Enable logging and monitoring
- Use environment-specific configuration

## Frontend Deployment

### 1. Build

```bash
cd frontend
npm install
npm run build
```

### 2. Environment Configuration

Create `frontend/.env.production`:

```env
VITE_API_URL=https://api.your-domain.com
VITE_MAPBOX_TOKEN=your-mapbox-token
VITE_WS_URL=wss://api.your-domain.com
```

### 3. Serve Static Files

The build output is in `frontend/dist/`. Serve with:

- **Nginx** (recommended)
- **Apache**
- **Vercel/Netlify** (for static hosting)
- **Docker** with nginx image

### 4. Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Mobile App Deployment

### iOS

1. Configure `mobile/app.json` with your bundle identifier
2. Build with Xcode or EAS Build
3. Submit to App Store

### Android

1. Configure `mobile/app.json` with your package name
2. Generate signing key
3. Build APK/AAB
4. Submit to Google Play Store

## Docker Deployment (Optional)

### docker-compose.yml Example

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: adlc_emergency
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/adlc_emergency
      JWT_SECRET: your-secret
      MAPBOX_ACCESS_TOKEN: your-token
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Regular security updates
- [ ] Database backups
- [ ] Environment variable security

## Monitoring

Recommended tools:

- **Application Monitoring**: Sentry, New Relic
- **Logging**: Winston, Pino, ELK Stack
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Database Monitoring**: pgAdmin, DataDog

## Backup Strategy

1. Database backups (daily)
2. Configuration backups
3. Media/file backups (if applicable)
4. Test restore procedures regularly

## Scaling Considerations

- Use load balancer for multiple backend instances
- Consider Redis for session management and caching
- Use CDN for frontend assets
- Database connection pooling
- Consider horizontal scaling for high traffic

