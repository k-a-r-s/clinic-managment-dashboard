# Machines API Endpoints

## Base URL
```
/machines
```

**Authentication:** All endpoints require Bearer token


## 1. Create Machine

**Endpoint:** `POST /machines`

**Description:** Create a new machine record

**Authentication:** Required

**Required Role:** `admin`

### Request Body
```typescript
{
  machineId: string;           // Required (HD-MAC-...)
  
  manufacturer?: string;
  model?: string;
  status?: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  lastMaintenanceDate: string; // YYYY-MM-DD
  nextMaintenanceDate: string; // YYYY-MM-DD
  
  room?: string;
}
```

### Response
**Success (201):** returns created machine object

---

## 2. Get All Machines

**Endpoint:** `GET /machines`

**Description:** Retrieve list of machines

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

**Response:**
```json
{
  "success": true,
  "message": "Machines retrieved successfully",
  "data": [ /* array of machines */ ],
  "error": null
}
```

---

## 3. Get Machine by ID

**Endpoint:** `GET /machines/:id`

**Description:** Retrieve a specific machine by its UUID

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

**Response:** 200 with machine object or 404 if not found.

---

## 4. Update Machine

**Endpoint:** `PUT /machines/:id`

**Description:** Update machine information

**Authentication:** Required

**Required Role:** `admin`

**Request body:** same as create but fields optional

**Response:** 200 with updated machine

---

## 5. Deactivate Machine

**Endpoint:** `PATCH /machines/:id/deactivate`

**Description:** Mark a machine as inactive/out-of-service

**Authentication:** Required

**Required Role:** `admin`

**Response:** 200 success

---

## 6. Machine Statistics (basic)

**Endpoint:** `GET /machines/stats`

**Description:** Returns raw machine stats with camelCase keys used by the frontend: total, available, inUse, maintenance, outOfService

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

**Response:** 200
```json
{
  "success": true,
  "message": "Machine stats retrieved successfully",
  "data": {
    "total": 42,
    "available": 30,
    "inUse": 5,
    "maintenance": 4,
    "outOfService": 3
  },
  "error": null
}
```

---

## 7. Machine Statistics (formatted keys)

**Endpoint:** `GET /machines/machine-stats`

**Description:** Returns machine stats formatted per product request using explicit keys: In_Use, Available, Out_of_Service, Maintenance, total

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

**Response:** 200
```json
{
  "success": true,
  "message": "Machine stats retrieved successfully",
  "data": {
    "In_Use": 5,
    "Available": 30,
    "Out_of_Service": 3,
    "Maintenance": 4,
    "total": 42
  },
  "error": null
}
```
