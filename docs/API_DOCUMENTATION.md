# API Documentation

Complete API reference for the Digital Business Card backend.

**Base URL:** `http://localhost:5000` (development) or `https://your-api.com` (production)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin Routes](#admin-routes)
3. [Analytics Routes](#analytics-routes)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

---

## Authentication

### POST `/api/auth/login`

Login with Firebase ID token and receive JWT tokens.

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "uid": "abc123",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

**Errors:**
- `400` - ID token required
- `401` - Authentication failed
- `404` - User not found

---

### POST `/api/auth/refresh`

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Errors:**
- `400` - Refresh token required
- `401` - Invalid refresh token
- `404` - User not found

---

## Admin Routes

All admin routes require `Authorization: Bearer <accessToken>` header.

### GET `/api/admin/verify`

Verify JWT token validity.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "uid": "abc123",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

**Errors:**
- `401` - No token provided / Invalid token

---

### GET `/api/admin/cards`

Get all cards. **Requires ADMIN role.**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
[
  {
    "id": "card123",
    "ownerUid": "user123",
    "name": "John Doe",
    "title": "CEO",
    "phone": "+1234567890",
    "email": "john@example.com",
    "website": "https://example.com",
    "profileImage": "https://...",
    "active": true,
    "connectEnabled": true,
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Errors:**
- `401` - Unauthorized
- `403` - Insufficient permissions (not ADMIN)
- `500` - Failed to fetch cards

---

### PUT `/api/admin/cards/:cardId`

Update card data. **Requires ADMIN or EDITOR role.**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "name": "John Doe",
  "title": "CEO & Founder",
  "phone": "+1234567890",
  "email": "john@example.com",
  "website": "https://example.com",
  "profileImage": "https://...",
  "active": true,
  "connectEnabled": true
}
```

**Response (200):**
```json
{
  "message": "Card updated successfully"
}
```

**Errors:**
- `400` - Name and email are required
- `401` - Unauthorized
- `403` - Insufficient permissions
- `500` - Failed to update card

---

### GET `/api/admin/analytics/:cardId`

Get analytics for a specific card. **Requires ADMIN, EDITOR, or VIEWER role.**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "totalVisits": 150,
  "mobileVisits": 100,
  "desktopVisits": 45,
  "tabletVisits": 5
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Insufficient permissions
- `500` - Failed to fetch analytics

---

## Analytics Routes

### POST `/api/analytics`

Track card visit. **Public endpoint (no authentication required).**

**Request:**
```json
{
  "cardId": "card123",
  "device": "mobile",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response (200):**
```json
{
  "message": "Analytics tracked successfully"
}
```

**Errors:**
- `400` - Card ID and device required
- `500` - Failed to track analytics

---

## Error Handling

All errors follow this format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing/invalid parameters) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error |

---

## Rate Limiting

API is rate-limited to **100 requests per 15 minutes** per IP address.

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

**Rate Limit Exceeded (429):**
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Authentication Flow

### Initial Login

```mermaid
sequenceDiagram
    Frontend->>Firebase: signInWithEmailAndPassword()
    Firebase-->>Frontend: User Credential
    Frontend->>Firebase: getIdToken()
    Firebase-->>Frontend: ID Token
    Frontend->>Backend: POST /api/auth/login {idToken}
    Backend->>Firebase Admin: verifyIdToken()
    Firebase Admin-->>Backend: Decoded Token
    Backend->>Firestore: Get user role
    Firestore-->>Backend: User data
    Backend->>Backend: Generate JWT tokens
    Backend-->>Frontend: {accessToken, refreshToken}
    Frontend->>Frontend: Store tokens in localStorage
```

### Authenticated Request

```mermaid
sequenceDiagram
    Frontend->>Backend: GET /api/admin/cards (with accessToken)
    Backend->>Backend: Verify JWT
    Backend->>Firestore: Query cards
    Firestore-->>Backend: Cards data
    Backend-->>Frontend: Cards array
```

### Token Refresh

```mermaid
sequenceDiagram
    Frontend->>Backend: GET /api/admin/cards (expired token)
    Backend-->>Frontend: 401 Unauthorized
    Frontend->>Backend: POST /api/auth/refresh {refreshToken}
    Backend->>Backend: Verify refresh token
    Backend->>Backend: Generate new accessToken
    Backend-->>Frontend: {accessToken}
    Frontend->>Frontend: Update localStorage
    Frontend->>Backend: Retry original request
    Backend-->>Frontend: Success
```

---

## Role-Based Access Control

### Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access (create, read, update, delete cards + analytics) |
| **EDITOR** | Edit cards only (no analytics, no user management) |
| **VIEWER** | View analytics only (read-only) |

### Endpoint Permissions

| Endpoint | ADMIN | EDITOR | VIEWER |
|----------|-------|--------|--------|
| `POST /api/auth/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/refresh` | ✅ | ✅ | ✅ |
| `GET /api/admin/verify` | ✅ | ✅ | ✅ |
| `GET /api/admin/cards` | ✅ | ❌ | ❌ |
| `PUT /api/admin/cards/:id` | ✅ | ✅ | ❌ |
| `GET /api/admin/analytics/:id` | ✅ | ✅ | ✅ |
| `POST /api/analytics` | ✅ (public) | ✅ (public) | ✅ (public) |

---

## Example Usage

### JavaScript (Axios)

```javascript
import axios from 'axios'

const API_URL = 'http://localhost:5000'

// Login
const login = async (idToken) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    idToken
  })
  
  localStorage.setItem('accessToken', response.data.accessToken)
  localStorage.setItem('refreshToken', response.data.refreshToken)
  
  return response.data
}

// Get cards (with auth)
const getCards = async () => {
  const token = localStorage.getItem('accessToken')
  
  const response = await axios.get(`${API_URL}/api/admin/cards`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  
  return response.data
}

// Update card
const updateCard = async (cardId, data) => {
  const token = localStorage.getItem('accessToken')
  
  const response = await axios.put(
    `${API_URL}/api/admin/cards/${cardId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  
  return response.data
}

// Track analytics (no auth)
const trackVisit = async (cardId, device) => {
  await axios.post(`${API_URL}/api/analytics`, {
    cardId,
    device,
    timestamp: new Date().toISOString()
  })
}
```

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_FIREBASE_ID_TOKEN"}'
```

**Get Cards:**
```bash
curl -X GET http://localhost:5000/api/admin/cards \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Update Card:**
```bash
curl -X PUT http://localhost:5000/api/admin/cards/card123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "title": "CEO",
    "phone": "+1234567890",
    "email": "john@example.com",
    "website": "https://example.com",
    "profileImage": "https://example.com/photo.jpg",
    "active": true,
    "connectEnabled": true
  }'
```

**Track Analytics:**
```bash
curl -X POST http://localhost:5000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "card123",
    "device": "mobile",
    "timestamp": "2024-01-15T10:30:00Z"
  }'
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Never expose JWT secrets**
3. **Rotate JWT secrets regularly**
4. **Set short expiry for access tokens (1 hour)**
5. **Use refresh tokens for long sessions**
6. **Validate all input data**
7. **Enable rate limiting**
8. **Monitor for suspicious activity**
9. **Keep dependencies updated**
10. **Use environment variables for all secrets**

---

## Testing

### Health Check

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 12345.67
}
```

### API Info

```bash
curl http://localhost:5000/
```

**Response:**
```json
{
  "message": "Digital Business Card API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "admin": "/api/admin",
    "analytics": "/api/analytics",
    "health": "/health"
  }
}
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Authentication with Firebase
- JWT-based authorization
- Role-based access control
- Card management endpoints
- Analytics tracking
- Rate limiting

---

**For more information, see:**
- [Firebase Setup Guide](FIREBASE_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Project Structure](PROJECT_STRUCTURE.md)
