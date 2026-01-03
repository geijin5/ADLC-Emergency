# ADLC Emergency Services Platform - Project Summary

## Overview

A complete production-ready public safety platform for Anaconda–Deer Lodge County Emergency Services (ADLCES) with separate public and personnel experiences.

## Architecture

### Tech Stack
- **Backend**: NestJS (TypeScript) with PostgreSQL
- **Frontend**: React (TypeScript) with Vite
- **Mobile**: React Native with Expo
- **Real-time**: WebSocket (Socket.io)
- **Mapping**: Mapbox GL JS
- **Authentication**: JWT with role-based access control

### Project Structure

```
adlc-emergency/
├── backend/          # NestJS API server
├── frontend/         # React web application
├── mobile/           # React Native mobile app
└── docs/             # Documentation
```

## Key Features

### Public Side (No Login Required)
✅ View-only access to emergency information
✅ Active alerts and advisories dashboard
✅ Interactive map with toggleable layers:
   - Road closures
   - Detours
   - Parade routes
   - Area closures
   - SAR operational areas
✅ Real-time updates via WebSocket
✅ Mobile-responsive design

### Personnel Side (Authentication Required)
✅ Role-based access control (Admin, Dispatch, Emergency Services, SAR)
✅ Personnel dashboard with active incidents
✅ Alert management system:
   - Create, edit, publish alerts
   - Target public/personnel/both
   - Scheduled delivery
   - Expiration times
✅ Interactive map editor:
   - Draw road closures, detours, routes
   - Road snapping to real geometry
   - Route following
   - Multiple layer types
✅ Internal chat system (real-time WebSocket)
✅ Search & Rescue operations management
✅ Mass call-out system with acknowledgments
✅ Audit logging for all sensitive operations

## Database Schema

- **users** - Personnel accounts with roles
- **alerts** - Emergency alerts and notifications
- **alert_acknowledgments** - User responses to alerts
- **map_features** - Map overlays (closures, routes, etc.)
- **chat_messages** - Internal communications
- **sar_operations** - Search & Rescue missions
- **sar_routes** - SAR operation routes
- **audit_logs** - System activity tracking

## Security Features

✅ JWT-based authentication
✅ Role-based authorization (RBAC)
✅ Encrypted API communication
✅ Input validation and sanitization
✅ SQL injection prevention (TypeORM)
✅ XSS protection
✅ CORS configuration
✅ Audit logging

## Hard Constraints Met

✅ No public reporting or submissions
✅ No public accounts or logins
✅ Public is view-only
✅ Roads and routes snap to real map geometry
✅ No straight-line map drawing
✅ Personnel control all published information

## Getting Started

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Set Up Database**
   ```bash
   createdb adlc_emergency
   cd backend
   npm run migration:run
   ```

3. **Configure Environment**
   - Copy `.env.example` files
   - Add Mapbox API token
   - Configure database connection
   - Set JWT secret

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

See `docs/SETUP.md` for detailed setup instructions.

## Documentation

- **SETUP.md** - Installation and setup guide
- **DEPLOYMENT.md** - Production deployment guide
- **API.md** - API documentation
- **README.md** - Project overview

## Next Steps

1. Create initial admin user
2. Configure Mapbox API key
3. Set up email/SMS notifications (optional)
4. Customize branding and styling
5. Review and adjust security settings
6. Plan production deployment

## Notes

- The system is designed for notifications, situational awareness, and mapping only
- No public submission forms are included
- All map features use real road geometry (no straight lines)
- Public users have read-only access
- Personnel have full control over published content

