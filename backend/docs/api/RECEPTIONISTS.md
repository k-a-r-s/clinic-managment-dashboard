# Receptionists API Endpoints

## Base URL

```text
/receptionists
```

**Authentication:** All endpoints require Bearer token

---

## 1. Get All Receptionists

**Endpoint:** `GET /receptionists`

**Description:** Returns a paginated list of receptionists. Uses joined `profiles` for name/email and `receptionists` for receptionist-specific fields like `phone_number`.

**Authentication:** Required

**Required Role:** `admin`

**Response:** 200

        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "phone_number": "+1 555 123"
      }
    ]
  },
  "error": null
}
```

---

## 2. Get Receptionist by ID

**Endpoint:** `GET /receptionists/{id}`

**Description:** Returns a single receptionist by profile UUID.

**Authentication:** Required

**Required Role:** `admin`

**Responses:**
- 200: receptionist object
- 404: receptionist not found

---

## 3. Update Receptionist

**Endpoint:** `PUT /receptionists/{id}`

**Description:** Update profile fields (firstName, lastName, email) and receptionist-specific fields (phoneNumber).

**Authentication:** Required

**Required Role:** `admin`
# Receptionists API Endpoints

## Base URL

```text
/receptionists
```

**Authentication:** All endpoints require Bearer token

---

## 1. Get All Receptionists

**Endpoint:** `GET /receptionists`

**Description:** Returns a paginated list of receptionists. Uses joined `profiles` for name/email and `receptionists` for receptionist-specific fields like `phone_number`.

**Authentication:** Required

**Required Role:** `admin`

**Response:** 200

```json
{
  "success": true,
  "message": "Receptionists retrieved successfully",
  "data": {
    "total": 2,
    "receptionists": [
      {
        "id": "uuid",
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "phone_number": "+1 555 123"
      }
    ]
  },
  "error": null
}
```

---

## 2. Get Receptionist by ID

**Endpoint:** `GET /receptionists/{id}`

**Description:** Returns a single receptionist by profile UUID.

**Authentication:** Required

**Required Role:** `admin`

**Responses:**

- 200: receptionist object

- 404: receptionist not found

---

## 3. Update Receptionist

**Endpoint:** `PUT /receptionists/{id}`

**Description:** Update profile fields (firstName, lastName, email) and receptionist-specific fields (phoneNumber).

**Authentication:** Required

**Required Role:** `admin`

**Request body example:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@clinic.com",
  "phoneNumber": "+1 555 4444"
}
```

**Responses:**

- 200: updated receptionist

- 404: receptionist not found

---

## 4. Delete Receptionist

**Endpoint:** `DELETE /receptionists/{id}`

**Description:** Delete the receptionist record (deletes from `receptionists` table; profile deletion/manipulation should be done via user management flows).

**Authentication:** Required

**Required Role:** `admin`

**Responses:**

- 200: success

- 404: receptionist not found
