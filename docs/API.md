# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Public Endpoints (No Auth Required)

### Get Public Alerts

```
GET /alerts/public
```

Returns all published, active alerts visible to the public.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Road Closure",
    "message": "Main Street closed for maintenance",
    "category": "road_closure",
    "priority": "high",
    "target": "public",
    "isActive": true,
    "isPublished": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

### Get Public Map Features

```
GET /maps/public
```

Returns all public map features (road closures, detours, etc.).

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Main Street Closure",
    "type": "road_closure",
    "visibility": "public",
    "geometry": {
      "type": "LineString",
      "coordinates": [[-112.9544, 46.1306], [-112.9550, 46.1310]]
    },
    "description": "Road closed for maintenance",
    "isActive": true
  }
]
```

### Get Public SAR Operations

```
GET /sar/public
```

Returns all publicly visible SAR operations.

## Authentication Endpoints

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "dispatch"
  }
}
```

## Personnel Endpoints (Auth Required)

### Alerts

- `GET /alerts` - Get all alerts (personnel)
- `GET /alerts/:id` - Get specific alert
- `POST /alerts` - Create alert
- `PATCH /alerts/:id` - Update alert
- `POST /alerts/:id/publish` - Publish alert
- `POST /alerts/:id/acknowledge?status=received` - Acknowledge alert
- `DELETE /alerts/:id` - Delete alert

### Map Features

- `GET /maps` - Get all map features (personnel)
- `GET /maps/:id` - Get specific feature
- `POST /maps` - Create map feature
- `PATCH /maps/:id` - Update map feature
- `DELETE /maps/:id` - Delete map feature

### Users

- `GET /users` - Get all users (Admin/Dispatch only)
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get specific user
- `POST /users` - Create user (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### SAR Operations

- `GET /sar` - Get all SAR operations (personnel)
- `GET /sar/:id` - Get specific operation
- `POST /sar` - Create SAR operation
- `PATCH /sar/:id` - Update operation
- `POST /sar/:id/routes` - Add route to operation
- `DELETE /sar/:id` - Delete operation

### Chat

- `GET /chat/channels/:channelType/:channelId` - Get channel messages
- WebSocket connection at `/chat` namespace
- Events: `send_message`, `new_message`, `join_channel`, `leave_channel`

## WebSocket Events

### Connect

```javascript
const socket = io('http://localhost:3000/chat', {
  auth: { token: 'jwt-token' }
});
```

### Send Message

```javascript
socket.emit('send_message', {
  channelType: 'group',
  channelId: 'general',
  message: 'Hello!'
});
```

### Receive Message

```javascript
socket.on('new_message', (message) => {
  console.log(message);
});
```

### Join Channel

```javascript
socket.emit('join_channel', {
  channelType: 'group',
  channelId: 'general'
});
```

## Data Models

### Alert Categories

- `emergency_alert`
- `road_closure`
- `detour`
- `parade_route`
- `area_closure`
- `search_rescue`
- `advisory`

### Alert Priorities

- `low`
- `medium`
- `high`
- `critical`

### Alert Targets

- `public`
- `personnel`
- `both`

### User Roles

- `admin`
- `dispatch`
- `emergency_services`
- `search_rescue`

### Map Feature Types

- `road_closure`
- `detour`
- `parade_route`
- `area_closure`
- `sar_operational_area`

### Acknowledgment Status

- `received`
- `responding`
- `unavailable`

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

