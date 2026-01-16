# Research & Decisions: Tool Development Request System

## 1. Technical Decisions

### D1: Framework & UI Library
- **Decision**: Next.js 14+ (App Router) + Tailwind CSS
- **Rationale**:
    - Spec NFR-005 requirements.
    - App Router provides efficient server-side rendering and simplified routing.
    - Tailwind is required for "Liquid Glass" implementation efficiency (utility-first).
- **Alternatives**:
    - React (Vite): Lacks built-in SSR/SEO benefits (though less critical for internal tool, Next.js is standard for the stack).

### D2: Database & Auth
- **Decision**: Firebase (Firestore + Auth)
- **Rationale**:
    - Spec FR-005/006 requirements.
    - Serverless infrastructure reduces maintenance for internal tools.
    - Built-in Google Auth provider meets SSO requirement seamlessly.
    - Real-time listeners (Firestore) perfect for Dashboard status updates.

### D3: State Management
- **Decision**: React Context + SWR/TanStack Query (or Firebase onSnapshot)
- **Rationale**:
    - Global state mostly needed for Auth (`UserContext`).
    - Data fetching (requests list) benefits from caching/revalidation of SWR/TanStack Query, although Firestore real-time listeners are also sufficient.
    - **Choice**: Default to standard `useEffect` + `onSnapshot` for dashboard to meet "Dashboard update < 2s" requirement (SC-001) most natively.

### D4: Design System Implementation (Liquid Glass)
- **Decision**: Custom Tailwind Utility Components + Framer Motion
- **Rationale**:
    - "Liquid Glass" is a specific aesthetic (backdrop-filter, mesh gradients).
    - No off-the-shelf UI library perfectly matches "iOS 26.1" out of the box without heavy overriding.
    - Custom components (Card, Button, Input) using Tailwind classes like `backdrop-blur-xl`, `bg-white/10`, `border-white/20` are most maintainable.

## 2. Unknowns & Clarifications (Resolved)

All clarifications were resolved during the `/speckit.clarify` phase (spec.md):
- **Auth**: Google SSO confirmed.
- **Ticket Format**: Sequential `REQ-YYYYMMDD-###` confirmed.
- **Department Data**: Manual input + Auto-save confirmed.

## 3. Implementation Strategy

- **Phase 1**: Setup Project, Firebase Config, Base UI Components (Liquid Glass theme).
- **Phase 2**: Auth Flow & User Profile (Department saving).
- **Phase 3**: Request Form (Submission logic, Transaction for Ticket ID).
- **Phase 4**: Admin Dashboard (List, Filter, Modal).
- **Phase 5**: Admin Features (Status update, Logo config).
