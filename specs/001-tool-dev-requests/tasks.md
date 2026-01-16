# Tasks: Tool Development Request System

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)
**Status**: Generated

## Phase 1: Setup
**Goal**: Initialize Next.js project and configure Firebase/Tailwind.

- [ ] T001 Initialize Next.js 14+ project (App Router) with TypeScript & Tailwind in `src/`
- [ ] T002 Configure strict TypeScript (`tsconfig.json`) and ESLint/Prettier rules
- [ ] T003 Install dependencies: `firebase`, `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`
- [ ] T004 Setup Tailwind theme (colors, fonts, keyframes) for Liquid Glass style in `tailwind.config.ts`
- [ ] T005 [P] Create `firebase.ts` and initialize app with env vars in `src/lib/firebase.ts`
- [ ] T006 [P] Create base UI primitives (Card, Button, Input) with backdrop-blur in `src/components/ui/`

## Phase 2: Foundation (Blocking)
**Goal**: Authentication and Core Services.

- [ ] T007 Implement `AuthContext` to manage user state in `src/lib/auth.ts`
- [ ] T008 Implement `signInWithGoogle` and `logout` in `src/lib/auth.ts`
- [ ] T009 Create `Login` page with Liquid Glass aesthetic in `src/app/login/page.tsx`
- [ ] T010 Implement `PrivateRoute` / Middleware protection for protected routes (`/dashboard`, `/request`)
- [ ] T011 [P] Implement `checkIsAdmin` logic reading from `admin_list` collection in `src/lib/services/authService.ts`
- [ ] T012 Define Firestore types/interfaces (Request, User, Config) in `src/lib/types.ts`

## Phase 3: User Story 1 - Submit Development Request (P1)
**Goal**: Users can submit requests with auto-filled info.

- [ ] T013 [US1] Implement `UserProfile` service to save/load department in `src/lib/services/userService.ts`
- [ ] T014 [US1] Implement `createRequest` transaction (ID generation) in `src/lib/services/requestService.ts`
- [ ] T015 [US1] Create `RequestForm` component with validation in `src/components/forms/RequestForm.tsx`
- [ ] T016 [US1] Implement Request Page (loading state, auto-fill logic) in `src/app/request/page.tsx`
- [ ] T017 [US1] Add success/error toast notifications (using a lightweight toast lib or custom)
- [ ] T018 [US1] Verify Ticket ID generation sequence (Manual Test)

## Phase 4: User Story 2 - Dashboard & Status Tracking (P1)
**Goal**: Users can view and filter request status.

- [ ] T019 [US2] Implement `subscribeToRequests` service with filters in `src/lib/services/requestService.ts`
- [ ] T020 [US2] Create `StatusBadge` component (Black/Gray/Red/Orange/Green) in `src/components/ui/StatusBadge.tsx`
- [ ] T021 [US2] Create `RequestCard` and `RequestList` components in `src/components/ui/`
- [ ] T022 [US2] Implement Dashboard Page with Search & Filter UI in `src/app/page.tsx`
- [ ] T023 [US2] Create `RequestDetailModal` for full view in `src/components/ui/RequestDetailModal.tsx`
- [ ] T024 [US2] Verify real-time updates when status changes (Manual Test)

## Phase 5: User Story 3 - Admin Management (P1)
**Goal**: Admin can manage requests and config.

- [ ] T025 [US3] Implement `updateRequestAdmin` and `deleteRequest` services in `src/lib/services/requestService.ts`
- [ ] T026 [US3] Add "Edit Mode" to `RequestDetailModal` (only for Admins)
- [ ] T027 [US3] Implement Admin Settings Page (Logo Upload UI) in `src/app/admin/page.tsx`
- [ ] T028 [US3] Implement `updateSystemLogo` service (Storage upload) in `src/lib/services/configService.ts`
- [ ] T029 [US3] Update `Navbar` to show Admin Link only for Admins in `src/components/layout/Navbar.tsx`
- [ ] T030 [US3] Verify Security Rules (User cannot delete/edit others' requests) in `firestore.rules`

## Phase 6: Polish
**Goal**: Final UI adjustments and Performance.

- [ ] T031 Refine animations (framer-motion) for page transitions and modal opening
- [ ] T032 Audit accessibility (contrast ratio for glassmorphism)
- [ ] T033 Deployment configuration (Vercel/Firebase Hosting)

## Dependencies
- Phase 1 & 2 must complete before Phase 3-5.
- Phase 3, 4, 5 are largely independent features but share the User context from Phase 2.

## Parallel Execution
- T005 and T006 can be done in parallel.
- T013 (User Profile) and T014 (Request Service) can be implemented in parallel by different devs.
