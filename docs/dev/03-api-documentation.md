# API Documentation

Complete reference for all Blendtune API endpoints.

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

Most endpoints require authentication via session cookies.

**Authentication Method**: HTTP-only cookies
**Session Duration**: Configurable (default: 7 days)
**Token Format**: Secure random string

### Session Cookie

```
Cookie: session=<token>
HttpOnly: true
Secure: true (production)
SameSite: Lax
```

## Response Format

### Success Response

```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST creating resource
- `204 No Content` - Successful DELETE or PUT with no content
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., email already exists)
- `500 Internal Server Error` - Server error

---

## Endpoints

## Tracks API

### Get All Tracks

Retrieve all tracks from the catalog.

**Endpoint**: `GET /api/tracks`

**Authentication**: Required

**Query Parameters**: None (pagination planned)

**Response**:

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Summer Vibes",
      "artist": "John Producer",
      "duration": 180,
      "tempo": 120,
      "musicalKey": "C",
      "scale": "major",
      "genre": "Electronic",
      "subgenre": "House",
      "mood": ["uplifting", "energetic"],
      "instruments": ["synth", "drums", "bass"],
      "audioUrl": "https://cdn.example.com/audio/summer-vibes.mp3",
      "coverArt": "https://cdn.example.com/covers/summer-vibes.jpg",
      "arrangement": [
        { "section": "intro", "startTime": 0, "endTime": 8 },
        { "section": "verse", "startTime": 8, "endTime": 32 },
        { "section": "chorus", "startTime": 32, "endTime": 64 }
      ],
      "creators": [
        {
          "name": "John Producer",
          "role": "producer",
          "ipi": "00123456789"
        }
      ],
      "samples": [],
      "exclusiveRights": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Database error

**Example Request**:

```bash
curl -X GET https://api.example.com/api/tracks \
  -H "Cookie: session=your-session-token"
```

---

## Audio Streaming API

### Stream Audio File

Stream an audio file with range request support.

**Endpoint**: `GET /api/audio/:filename`

**Authentication**: Required

**Path Parameters**:
- `filename` (string, required) - Audio file name

**Headers**:
- `Range` (optional) - Byte range (e.g., `bytes=0-1023`)

**Response**:

**Status**: `206 Partial Content` (with Range) or `200 OK` (full file)

**Headers**:
```
Content-Type: audio/mpeg
Content-Length: <size>
Accept-Ranges: bytes
Content-Range: bytes 0-1023/102400 (if partial)
Cache-Control: public, max-age=31536000, immutable
```

**Body**: Audio file binary data

**Error Responses**:
- `401 Unauthorized` - No valid session
- `404 Not Found` - File not found
- `416 Range Not Satisfiable` - Invalid range
- `500 Internal Server Error` - Streaming error

**Example Request**:

```bash
# Full file
curl -X GET https://api.example.com/api/audio/summer-vibes.mp3 \
  -H "Cookie: session=token"

# Range request
curl -X GET https://api.example.com/api/audio/summer-vibes.mp3 \
  -H "Cookie: session=token" \
  -H "Range: bytes=0-1023"
```

---

## Authentication API

### Sign Up

Create a new user account.

**Endpoint**: `POST /api/auth/signup`

**Authentication**: Not required

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "acceptTerms": true
}
```

**Validation**:
- `email`: Valid email format, unique
- `password`: Minimum 8 characters
- `firstName`: 1-50 characters
- `lastName`: 1-50 characters
- `acceptTerms`: Must be true

**Response**:

```json
{
  "message": "Account created successfully. Please check your email to verify your account.",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

**Example Request**:

```bash
curl -X POST https://api.example.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "acceptTerms": true
  }'
```

---

### Sign In

Authenticate a user and create a session.

**Endpoint**: `POST /api/auth/login`

**Authentication**: Not required

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**:

```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true
  }
}
```

**Set-Cookie Header**:
```
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
```

**Error Responses**:
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Email not verified
- `500 Internal Server Error` - Server error

**Example Request**:

```bash
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Sign Out

End the current user session.

**Endpoint**: `POST /api/auth/logout`

**Authentication**: Required

**Request Body**: None

**Response**:

```json
{
  "message": "Logout successful"
}
```

**Set-Cookie Header**:
```
Set-Cookie: session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0
```

**Error Responses**:
- `500 Internal Server Error` - Server error

**Example Request**:

```bash
curl -X POST https://api.example.com/api/auth/logout \
  -H "Cookie: session=your-token"
```

---

### Check Session

Validate current session and get user info.

**Endpoint**: `GET /api/auth/security/check-session`

**Authentication**: Required

**Response**:

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true
  },
  "session": {
    "createdAt": "2024-01-15T10:00:00Z",
    "expiresAt": "2024-01-22T10:00:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid or expired session

---

## Email Verification API

### Confirm Email

Verify user's email address with token.

**Endpoint**: `POST /api/auth/security/confirm-email`

**Authentication**: Not required

**Request Body**:

```json
{
  "token": "verification-token-from-email"
}
```

**Response**:

```json
{
  "message": "Email verified successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid token format
- `404 Not Found` - Token not found or expired
- `500 Internal Server Error` - Server error

---

### Resend Verification Email

Send a new verification email.

**Endpoint**: `POST /api/auth/security/resend-verification`

**Authentication**: Required

**Response**:

```json
{
  "message": "Verification email sent"
}
```

**Error Responses**:
- `400 Bad Request` - Email already verified
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Password Reset API

### Request Password Reset

Initiate password reset process.

**Endpoint**: `POST /api/auth/security/reset-password/create`

**Authentication**: Not required

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response**:

```json
{
  "message": "If an account exists, a password reset email has been sent"
}
```

**Note**: Always returns success to prevent email enumeration

**Error Responses**:
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

### Verify Reset Token

Check if password reset token is valid.

**Endpoint**: `GET /api/auth/security/reset-password/verify?token=<token>`

**Authentication**: Not required

**Query Parameters**:
- `token` (string, required) - Reset token from email

**Response**:

```json
{
  "valid": true,
  "email": "user@example.com"
}
```

**Error Responses**:
- `400 Bad Request` - Missing token
- `404 Not Found` - Invalid or expired token

---

### Reset Password

Complete password reset with new password.

**Endpoint**: `POST /api/auth/security/reset-password/confirm`

**Authentication**: Not required

**Request Body**:

```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

**Validation**:
- `password`: Minimum 8 characters

**Response**:

```json
{
  "message": "Password reset successful"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid password or token
- `404 Not Found` - Token not found or expired
- `500 Internal Server Error` - Server error

---

## Account Management API

### Get Account Info

Retrieve current user's account information.

**Endpoint**: `GET /api/account`

**Authentication**: Required

**Response**:

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "profile": {
    "bio": "Music enthusiast",
    "avatar": "https://cdn.example.com/avatars/user.jpg"
  },
  "subscription": {
    "plan": "pro",
    "status": "active",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### Update Profile

Update user profile information.

**Endpoint**: `PUT /api/account/profile`

**Authentication**: Required

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio"
}
```

**Response**:

```json
{
  "message": "Profile updated successfully",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Updated bio"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

## Rate Limiting

**Current Status**: Not implemented
**Planned Limits**:

- Authentication endpoints: 5 requests / 15 minutes
- Password reset: 3 requests / hour
- General API: 1000 requests / hour

**Rate Limit Headers** (planned):

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `EMAIL_NOT_VERIFIED` | Email verification required |
| `EMAIL_EXISTS` | Email already registered |
| `INVALID_TOKEN` | Invalid or expired token |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `VALIDATION_ERROR` | Input validation failed |
| `NOT_FOUND` | Resource not found |
| `SERVER_ERROR` | Internal server error |

---

## Pagination (Planned)

Future endpoints will support pagination:

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)
- `sort` (string, e.g., "createdAt:desc")

**Response**:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "totalPages": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Webhooks (Planned)

Future webhook support for events:

- `user.created`
- `user.email_verified`
- `subscription.created`
- `subscription.cancelled`

---

## Versioning

**Current Version**: v1 (implicit)
**Future Versions**: Will use URL versioning (e.g., `/api/v2/tracks`)

---

## SDK / Client Libraries

**Status**: Not available
**Planned**: JavaScript/TypeScript SDK for easier integration

---

## Testing APIs

Use the following test credentials in development:

```json
{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Note**: Test users are reset daily in development environment

---

## Additional Resources

- [Architecture Overview](./02-architecture.md)
- [Database Schema](./04-database-schema.md)
- [Contributing Guidelines](./05-contributing.md)

---

**Last Updated**: January 2025
