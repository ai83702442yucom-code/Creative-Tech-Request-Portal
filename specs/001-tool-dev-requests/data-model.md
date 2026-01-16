# Data Model

## Firestore Collections

### `users`
Storage for user profiles and preferences (e.g., Department).

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | **(Key)** Firebase Auth UID |
| `email` | string | User email |
| `displayName` | string | User display name |
| `photoURL` | string | User avatar URL |
| `department` | string | Last used department (for auto-fill) |
| `updatedAt` | timestamp | Last update time |
| `roles` | array<string> | Optional: `['admin']` for RBAC optimization |

---

### `requests`
Storage for tool development requests.

| Field | Type | Description |
|-------|------|-------------|
| `doc_id` | string | **(Key)** Auto-generated ID |
| `ticketNo` | string | **Unique** Sequential ID (REQ-YYYYMMDD-###) |
| `applicantUid` | string | Reference to `users.uid` |
| `applicantName` | string | Snapshot of applicant name at submission |
| `department` | string | Snapshot of department at submission |
| `toolName` | string | Tool Name |
| `description` | string | Detailed description |
| `criteria` | string | Acceptance criteria |
| `status` | string | `pending` (default), `discussing`, `developing`, `done`, `cancelled` |
| `adminNote` | string | Admin discussion notes (Admin only edit) |
| `estimatedDate` | timestamp | Estimated completion date (Admin only edit) |
| `createdAt` | timestamp | Creation time |
| `updatedAt` | timestamp | Last update time |

---

### `counters`
Used for generating sequential Ticket IDs.

| Field | Type | Description |
|-------|------|-------------|
| `doc_id` | string | **(Key)** `requests_shard_{DATE}` e.g., `requests_20260116` |
| `count` | number | Atomic counter for that day |

---

### `config`
System-wide configuration.

| Field | Type | Description |
|-------|------|-------------|
| `doc_id` | string | **(Key)** `system` |
| `logoUrl` | string | URL of the current system logo |
| `updatedAt` | timestamp | Last update time |

---

### `admin_list`
Whitelist for admin privileges.

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | **(Key)** Admin User UID |
| `addedBy` | string | UID of who added this admin |
| `addedAt` | timestamp | Time added |

## Validation Rules

- **Ticket Number**: Must be unique. Generated via Transaction:
    1. Read `counters/requests_{today}`.
    2. Increment `count`.
    3. Format `REQ-{today}-{count}`.
    4. Write to `requests`.
- **Status Transitions**:
    - User can only create (`pending`).
    - Only Admin can change `status`.
- **RBAC**:
    - `requests`: Read (All), Create (Auth User), Update (Admin only specific fields), Delete (Admin only).
    - `config`: Read (All), Update (Admin only).
