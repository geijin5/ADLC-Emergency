# Setup Instructions

## Initial Setup

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Database Setup

**Option A: Local PostgreSQL**

```bash
# Create PostgreSQL database
createdb adlc_emergency

# Or using psql
psql -U postgres
CREATE DATABASE adlc_emergency;
```

**Option B: AWS RDS PostgreSQL (Recommended for Production)**

1. Create an RDS PostgreSQL instance in AWS Console
2. Note the connection details (endpoint, username, password, port)
3. Configure security groups to allow connections
4. See `docs/AWS_RDS_SETUP.md` for detailed setup instructions

For now, update your `backend/.env` with the RDS connection string:
```
DATABASE_URL=postgresql://username:password@your-rds-endpoint.region.rds.amazonaws.com:5432/adlc_emergency
```

### 3. Backend Configuration

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Update `backend/.env`:
- Set `DATABASE_URL` to your PostgreSQL connection string
- Set `JWT_SECRET` to a random secure string
- Add your `MAPBOX_ACCESS_TOKEN`
- Configure email/SMS if needed (optional)

### 4. Run Migrations

```bash
cd backend
npm run migration:run
```

### 5. Create Initial Admin User

You can create an admin user using a script or directly in the database:

```sql
-- Insert admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@adlc.local',
  '$2b$10$YourHashedPasswordHere', -- Use bcrypt to hash your password
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

Or use a seed script (create one if needed).

### 6. Frontend Configuration

```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

Update `frontend/.env`:
- Set `VITE_API_URL` to your backend URL (default: http://localhost:3000)
- Add your `VITE_MAPBOX_TOKEN`
- Set `VITE_WS_URL` for WebSocket connection

### 7. Start Development Servers

```bash
# From root directory - starts both backend and frontend
npm run dev

# Or start separately:
npm run dev:backend  # Backend on http://localhost:3000
npm run dev:frontend # Frontend on http://localhost:5173
```

### 8. Mobile App Setup (Optional)

```bash
cd mobile
npm install
npm start
```

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## Development Workflow

### Backend

- API runs on `http://localhost:3000/api`
- WebSocket server runs on `ws://localhost:3000/chat`
- Hot reload enabled in development mode
- Database migrations: `npm run migration:run`
- Generate migration: `npm run migration:generate -- -n MigrationName`

### Frontend

- Runs on `http://localhost:5173`
- Hot module replacement enabled
- Public routes: `/` and `/map`
- Personnel routes: `/personnel/*` (requires authentication)

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when added)
cd frontend
npm test
```

## Common Issues

### Database Connection Error

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Mapbox Errors

- Verify MAPBOX_ACCESS_TOKEN is set
- Check token permissions
- Ensure token is valid

### CORS Errors

- Verify CORS_ORIGIN in backend .env includes frontend URL
- Check backend CORS configuration

### WebSocket Connection Failed

- Verify WS_URL in frontend .env
- Check WebSocket gateway configuration
- Ensure backend is running

## Next Steps

1. Create admin user account
2. Configure Mapbox API key
3. Set up email/SMS notifications (optional)
4. Customize branding and styling
5. Review security settings
6. Set up production deployment

