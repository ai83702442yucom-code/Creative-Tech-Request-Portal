# Quickstart Guide: Tool Development Request System

## Prerequisites
- Node.js 18+
- Java (for Firebase Emulators, optional)

## Setup

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd <repo>
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:3000`.

4. **Run Tests**
   ```bash
   npm run test        # Unit tests
   npm run e2e         # Cypress tests
   ```

## Development Workflow

- **Styling**: Use utility classes (Tailwind). See `components/ui` for "Liquid Glass" primitives.
- **State**: Use `useAuth` hook for user context.
- **Database**: Do NOT call Firestore directly in components. Use `lib/services/*` functions.
