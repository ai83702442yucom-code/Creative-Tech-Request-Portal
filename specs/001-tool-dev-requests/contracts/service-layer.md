# Service Interface Contracts

Since this project uses Firebase Client SDKs directly, we don't have traditional REST API endpoints. Instead, we define the **Service Functions** (TypeScript interfaces) that the UI will call.

## Request Service (`lib/services/requestService.ts`)

```typescript
interface SubmitRequestParams {
  toolName: string;
  description: string;
  criteria: string;
  department: string;
}

/**
 * Creates a new request transactionally.
 * 1. Generates Ticket ID.
 * 2. Creates Request Document.
 * 3. Updates User Profile (department).
 */
function createRequest(params: SubmitRequestParams): Promise<string>; // returns docId

/**
 * Real-time subscription to requests.
 * Supports filtering by status or search text.
 */
function subscribeToRequests(
  filter: { status?: RequestStatus; search?: string },
  callback: (requests: Request[]) => void
): Unsubscribe;

/**
 * Admin: Update request details.
 */
function updateRequestAdmin(
  docId: string, 
  data: { 
    status?: RequestStatus; 
    adminNote?: string; 
    estimatedDate?: Date 
  }
): Promise<void>;

/**
 * Admin: Delete request.
 */
function deleteRequest(docId: string): Promise<void>;
```

## Config Service (`lib/services/configService.ts`)

```typescript
/**
 * Uploads logo to Firebase Storage and updates config doc.
 */
function updateSystemLogo(file: File): Promise<string>; // returns new URL

/**
 * Real-time subscription to system config (Logo).
 */
function subscribeToConfig(callback: (config: SystemConfig) => void): Unsubscribe;
```

## Auth Service (`lib/services/authService.ts`)

```typescript
/**
 * Signs in with Google Popup.
 */
function signInWithGoogle(): Promise<User>;

/**
 * Signs out.
 */
function logout(): Promise<void>;

/**
 * Checks if current user is Admin.
 * (Checks existence in admin_list collection or custom claim)
 */
function checkIsAdmin(uid: string): Promise<boolean>;
```
