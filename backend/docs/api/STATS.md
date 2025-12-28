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

**Required Role:** `admin`

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "totalPatients": 123,
    "activeSessions": 8,
    "activemachines": 37,
    "staffCount": 12,
    "staffSublabel": "8 doctors, 4 receptionists",
    "patientsThisWeek": 5,
    "appointmentsThisWeek": 12,
    "patientsPerDay": [
      { "date": "2024-12-22", "count": 0 },
      { "date": "2024-12-23", "count": 1 }
    ],
    "appointmentsPerDay": [
      { "date": "2024-12-22", "count": 2 },
      { "date": "2024-12-23", "count": 1 }
    ]
  },
  "error": null
}
```

**Notes:**

- `activeSessions` counts appointments scheduled for today with status `SCHEDULED`.
 - `activeSessions` counts appointments scheduled for today with status `SCHEDULED`.

 - `activemachines` equals total machines minus `out_of_service` machines.

 - `staffCount` is computed by summing users with role `doctor` and `receptionist`.

### Notes

 - Endpoint requires an `admin` role per current implementation (enforced by server-side middleware).
 - The `data` object follows the `DashboardStats` schema used by the backend use-case.