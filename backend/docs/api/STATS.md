# Dashboard Stats API

Docs placeholder: Dashboard statistics endpoint.
# Dashboard Stats API

## Base URL

```text
/stats
```

**Authentication:** All endpoints require Bearer token

---

## 1. Get Dashboard Statistics

**Endpoint:** `GET /stats`

**Description:** Returns aggregated metrics for the dashboard.

**Authentication:** Required

**Required Role:** `admin`, `doctor`, `receptionist`

**Response (200):**

```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalPatients": 123,
    "activeSessions": 8,
    "activemachines": 37,
    "staffCount": 12,
    "staffSublabel": "8 doctors, 4 receptionists"
  },
  "error": null
}
```

**Notes:**

- `activeSessions` counts appointments scheduled for today with status `SCHEDULED`.

- `activemachines` equals total machines minus out_of_service machines.

- `staffCount` is computed by summing users with role `doctor` and `receptionist`.