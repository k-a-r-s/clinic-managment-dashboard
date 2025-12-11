# Room Management API Documentation

## Overview
The Room Management API provides endpoints for managing clinic rooms, including creating, updating, retrieving, and deleting room information. It also supports availability management for better resource allocation.

## Base URL
```
http://localhost:3000/rooms
```

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All endpoints follow a unified response format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "error": {
    "name": "ErrorType",
    "message": "Detailed error message",
    "statusCode": 400
  }
}
```

## Endpoints

### 1. Create Room
Create a new room in the system.

**Endpoint:** `POST /rooms`

**Required Role:** `admin`, `receptionist`

**Request Body:**
```json
{
  "roomNumber": "101",
  "capacity": 2,
  "type": "consultation",
  "isAvailable": true
}
```

**Field Descriptions:**
- `roomNumber` (string, required): Unique identifier for the room
- `capacity` (number, optional): Maximum occupancy, default: 1
- `type` (string, optional): Room type (e.g., "consultation", "surgery", "emergency"), default: "consultation"
- `isAvailable` (boolean, optional): Availability status, default: true

**Success Response (201):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": 1,
    "roomNumber": "101",
    "capacity": 2,
    "type": "consultation",
    "isAvailable": true,
    "createdAt": "2024-12-11T10:00:00.000Z",
    "updatedAt": "2024-12-11T10:00:00.000Z"
  },
  "error": null
}
```

**Error Responses:**
- `400`: Validation error (e.g., missing roomNumber, invalid capacity)
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (insufficient permissions)

---

### 2. Get All Rooms
Retrieve a list of all rooms.

**Endpoint:** `GET /rooms`

**Required Role:** Any authenticated user

**Success Response (200):**
```json
{
  "success": true,
  "message": "Rooms retrieved successfully",
  "data": [
    {
      "id": 1,
      "roomNumber": "101",
      "capacity": 2,
      "type": "consultation",
      "isAvailable": true,
      "createdAt": "2024-12-11T10:00:00.000Z",
      "updatedAt": "2024-12-11T10:00:00.000Z"
    },
    {
      "id": 2,
      "roomNumber": "102",
      "capacity": 1,
      "type": "surgery",
      "isAvailable": false,
      "createdAt": "2024-12-11T11:00:00.000Z",
      "updatedAt": "2024-12-11T11:00:00.000Z"
    }
  ],
  "error": null
}
```

---

### 3. Get Available Rooms
Retrieve only rooms that are currently available.

**Endpoint:** `GET /rooms/available`

**Required Role:** Any authenticated user

**Success Response (200):**
```json
{
  "success": true,
  "message": "Available rooms retrieved successfully",
  "data": [
    {
      "id": 1,
      "roomNumber": "101",
      "capacity": 2,
      "type": "consultation",
      "isAvailable": true,
      "createdAt": "2024-12-11T10:00:00.000Z",
      "updatedAt": "2024-12-11T10:00:00.000Z"
    }
  ],
  "error": null
}
```

---

### 4. Get Room by ID
Retrieve a specific room by its ID.

**Endpoint:** `GET /rooms/:id`

**Required Role:** Any authenticated user

**URL Parameters:**
- `id` (integer): Room ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room retrieved successfully",
  "data": {
    "id": 1,
    "roomNumber": "101",
    "capacity": 2,
    "type": "consultation",
    "isAvailable": true,
    "createdAt": "2024-12-11T10:00:00.000Z",
    "updatedAt": "2024-12-11T10:00:00.000Z"
  },
  "error": null
}
```

**Error Responses:**
- `404`: Room not found
- `401`: Unauthorized

---

### 5. Update Room
Update room information.

**Endpoint:** `PATCH /rooms/:id`

**Required Role:** `admin`, `receptionist`

**URL Parameters:**
- `id` (integer): Room ID

**Request Body (all fields optional):**
```json
{
  "roomNumber": "101A",
  "capacity": 3,
  "type": "surgery",
  "isAvailable": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": {
    "id": 1,
    "roomNumber": "101A",
    "capacity": 3,
    "type": "surgery",
    "isAvailable": false,
    "createdAt": "2024-12-11T10:00:00.000Z",
    "updatedAt": "2024-12-11T12:00:00.000Z"
  },
  "error": null
}
```

**Error Responses:**
- `400`: Validation error (e.g., invalid capacity)
- `404`: Room not found
- `401`: Unauthorized
- `403`: Forbidden

---

### 6. Update Room Availability
Quickly update only the availability status of a room.

**Endpoint:** `PATCH /rooms/:id/availability`

**Required Role:** `admin`, `receptionist`, `doctor`

**URL Parameters:**
- `id` (integer): Room ID

**Request Body:**
```json
{
  "isAvailable": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room availability updated successfully",
  "data": null,
  "error": null
}
```

**Error Responses:**
- `400`: Validation error (missing or invalid isAvailable)
- `404`: Room not found
- `401`: Unauthorized
- `403`: Forbidden

---

### 7. Delete Room
Permanently delete a room from the system.

**Endpoint:** `DELETE /rooms/:id`

**Required Role:** `admin`

**URL Parameters:**
- `id` (integer): Room ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Room deleted successfully",
  "data": null,
  "error": null
}
```

**Error Responses:**
- `404`: Room not found
- `401`: Unauthorized
- `403`: Forbidden (only admins can delete)

---

## Room Types
Common room types include:
- `consultation`: Standard examination rooms
- `surgery`: Operating rooms
- `emergency`: Emergency treatment rooms
- `laboratory`: Lab testing rooms
- `radiology`: Imaging rooms (X-ray, CT, MRI)
- `ward`: Patient ward/recovery rooms

---

## Authorization Roles
- **admin**: Full access to all operations
- **receptionist**: Can create, view, and update rooms
- **doctor**: Can view rooms and update availability
- **patient**: Can only view rooms

---

## Example Usage

### Creating a Room with cURL
```bash
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "roomNumber": "101",
    "capacity": 2,
    "type": "consultation",
    "isAvailable": true
  }'
```

### Getting Available Rooms with JavaScript
```javascript
const response = await fetch('http://localhost:3000/rooms/available', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log(result.data); // Array of available rooms
```

### Updating Room Availability
```bash
curl -X PATCH http://localhost:3000/rooms/1/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"isAvailable": false}'
```

---

## Error Codes Summary
| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Notes
- Room numbers must be unique across the system
- Capacity must be a positive integer
- Deleting a room is permanent and cannot be undone
- Consider implementing soft deletes for production systems
- Room availability should be updated when appointments are scheduled/completed

---

## Database Schema
```sql
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  room_number VARCHAR(50) UNIQUE NOT NULL,
  capacity INTEGER DEFAULT 1,
  type VARCHAR(50) DEFAULT 'consultation',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
