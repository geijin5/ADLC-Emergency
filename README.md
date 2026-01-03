# ADLC Emergency Services Platform

Production-ready public safety platform for Anaconda–Deer Lodge County Emergency Services (ADLCES).

## Architecture

This is a monorepo containing three main applications:

- **Backend**: NestJS API server with PostgreSQL, WebSocket support, and JWT authentication
- **Frontend**: React (TypeScript) web application with separate public and personnel experiences
- **Mobile**: React Native application for iOS and Android

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+ (local or AWS RDS)
- Mapbox API key (sign up at https://mapbox.com)
- Redis (optional, for caching and session management)
- AWS Account (if using AWS RDS - see `docs/AWS_RDS_SETUP.md`)

### Installation

```bash
# Install all dependencies
npm run install:all

# Set up environment variables (see .env.example files in each directory)
# Backend: backend/.env
# Frontend: frontend/.env
# Mobile: mobile/.env

# Run database migrations
cd backend
npm run migration:run

# Start development servers
npm run dev
```

### Environment Setup

#### Backend (.env)
```
# Database - Local PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/adlc_emergency

# OR AWS RDS PostgreSQL
# DATABASE_URL=postgresql://username:password@your-rds-endpoint.region.rds.amazonaws.com:5432/adlc_emergency

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
PORT=3000
MAPBOX_ACCESS_TOKEN=your-mapbox-token
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=your-mapbox-token
VITE_WS_URL=ws://localhost:3000
```

## Project Structure

```
adlc-emergency/
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── auth/      # Authentication & authorization
│   │   ├── users/     # User management
│   │   ├── alerts/    # Alert/notification system
│   │   ├── maps/      # Map data management
│   │   ├── chat/      # Internal chat system
│   │   ├── sar/       # Search & Rescue operations
│   │   └── common/    # Shared utilities
│   └── migrations/    # Database migrations
├── frontend/          # React web application
│   ├── src/
│   │   ├── public/    # Public-facing pages (no auth)
│   │   ├── personnel/ # Personnel portal (auth required)
│   │   └── shared/    # Shared components
├── mobile/            # React Native app
│   ├── src/
│   │   ├── public/    # Public features
│   │   ├── personnel/ # Personnel features
│   │   └── shared/    # Shared code
└── shared/            # Shared TypeScript types
```

## Features

### Public Side (No Login Required)
- View active emergency alerts and advisories
- Interactive map with toggleable layers (road closures, detours, parade routes, SAR areas)
- Real-time updates via WebSocket
- Push notifications (mobile)
- Search & Rescue public information display

### Personnel Side (Authentication Required)
- Role-based access control (Admin, Dispatch, Emergency Services, SAR)
- Personnel dashboard with active incidents
- Internal chat system (real-time)
- Mass call-out system with acknowledgment tracking
- Alert creation and management
- Map editing tools (road snapping, route following)
- SAR operational management
- Audit logging

## Security

- JWT-based authentication
- Role-based authorization (RBAC)
- Encrypted API communication (HTTPS)
- Input validation and sanitization
- SQL injection prevention (TypeORM)
- XSS protection
- CORS configuration
- Audit logging for sensitive operations

## Deployment

See deployment documentation:
- `docs/DEPLOYMENT.md` - General deployment guide
- `docs/RENDER_DEPLOYMENT.md` - Deploy to Render cloud platform
- `docs/AWS_RDS_SETUP.md` - AWS RDS PostgreSQL setup guide
- `docs/GITHUB_ACTIONS_APK.md` - Build Android APK with GitHub Actions

## License

Proprietary - ADLC Emergency Services

