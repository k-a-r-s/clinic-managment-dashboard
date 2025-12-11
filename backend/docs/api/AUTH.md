# Authentication API Endpoints

## Base URL
```
/auth
```

---

## 1. Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user with email and password

**Authentication:** Not required

### Request Body
```typescript
{
  email: string;      // Required, valid email format
  password: string;   // Required
}
```

**Example Request:**
```json
{
  "email": "admin@admin.com",
  "password": "admin"
}
```

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    expiresIn: number;        // Token expiration time in seconds
    tokenType: string;         // "Bearer"
    user: {
      id: string;              // UUID
      email: string;
      firstName: string;
      lastName: string;
      role: "admin" | "doctor" | "receptionist";
    }
  };
  error: null;
}
```

**Example Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "admin@admin.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin"
    }
  },
  "error": null
}
```

**Cookies Set:**
- `accessToken`: HTTP-only, Secure, SameSite=Strict, Max-Age=3600 (1 hour)
- `refreshToken`: HTTP-only, Secure, SameSite=Strict, Max-Age=604800 (7 days)

**Error (400):**
```typescript
{
  success: false;
  message: string;
  data: null;
  error: {
    name: string;
    message: string;
    statusCode: number;
  };
}
```

**Example Error Response:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null,
  "error": {
    "name": "AuthError",
    "message": "Invalid email or password",
    "statusCode": 400
  }
}
```

---

## 2. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user, invalidate session, and clear refresh token cookie

**Authentication:** Required (Bearer token)

### Request Body
None

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: null;
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null,
  "error": null
}
```

**Cookies Cleared:**
- `accessToken`: Cleared
- `refreshToken`: Cleared

**Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "error": {
    "name": "AuthError",
    "message": "Invalid or missing token",
    "statusCode": 401
  }
}
```

---

## 3. Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Description:** Get a new access token and refresh token using the refresh token stored in HTTP-only cookie

**Authentication:** Required (Refresh token in cookie)

### Request Body
None

### Cookies Required
- `refreshToken`: Must be present in cookies

### Response

**Success (200):**
```typescript
{
  success: boolean;
  message: string;
  data: {
    message: string;
  };
  error: null;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Tokens refreshed successfully",
  "data": {
    "message": "Tokens refreshed successfully"
  },
  "error": null
}
```

**Cookies Set:**
- `accessToken`: New HTTP-only token, Max-Age=3600 (1 hour)
- `refreshToken`: New HTTP-only token, Max-Age=604800 (7 days)

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "data": null,
  "error": {
    "name": "AuthError",
    "message": "Invalid or expired refresh token",
    "statusCode": 401
  }
}
```

---

## Security Notes

1. **Access Token:** Short-lived (1 hour), used for API requests
2. **Refresh Token:** Long-lived (7 days), used only for token refresh
3. **HTTP-Only Cookies:** Tokens stored in HTTP-only cookies prevent XSS attacks
4. **Secure Flag:** Cookies only transmitted over HTTPS in production
5. **SameSite:** Prevents CSRF attacks

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Invalid credentials or validation error |
| 401 | Unauthorized - Invalid or missing token |
| 500 | Internal server error |
