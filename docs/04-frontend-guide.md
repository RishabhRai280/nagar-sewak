# Frontend Developer Guide

## Overview
The Frontend is built with **Next.js 14 (App Router)** using TypeScript. It emphasizes a modern, responsive, and accessible UI for citizens, administrators, and contractors.

## Tech Stack
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Radix Primitives)
- **Icons:** Lucide React
- **Maps:** Leaflet (via `react-leaflet`)
- **Animation:** Framer Motion

---

## Project Structure (`frontend/`)

```
frontend/
├── app/                  # App Router Pages
│   ├── [locale]/        # Internationalized Routes (en/hi)
│   │   ├── dashboard/   # Protected Dashboard Pages
│   │   ├── login/       # Login Page
│   │   └── page.tsx     # Landing Page
│   └── layout.tsx       # Root Layout (Providers)
├── components/           # Reusable Components
│   ├── ui/              # Shadcn Base Components (Button, Card, etc.)
│   ├── complaints/      # Complaint-specific Widgets
│   └── shared/          # Common Layouts (Sidebar, Navbar)
├── lib/                  # Utilities
│   ├── api/             # API Clients & Types
│   ├── store/           # State Management (UserStore)
│   └── utils.ts         # Helper Functions
└── public/               # Static Assets (Images, Icons)
```

## Key Development Patterns

### 1. API Integration
We use a centralized API client in `lib/api/api.ts`.
- **Base URL:** configured via `NEXT_PUBLIC_API_BASE_URL`.
- **Fetches:** Standard `fetch` API is used.
- **Headers:** Auth tokens are retrieved from LocalStorage and added to headers automatically where needed.

**Example Usage:**
```typescript
import { fetchComplaints } from '@/lib/api/api';

const loadData = async () => {
  const data = await fetchComplaints();
  setComplaints(data);
};
```

### 2. State Management (`UserStore`)
Profile data is stored in `UserStore` (a wrapper around LocalStorage) to avoid repeated API calls.
- **Set User:** `UserStore.set(userProfile)`
- **Get User:** `const user = UserStore.get()`
- **Check Role:** `if (user.roles.includes('ADMIN')) ...`

### 3. Styling with Tailwind & Shadcn
- Use utility classes for layout: `flex items-center justify-between p-4`.
- Use Shadcn components for complex UI:
    ```tsx
    import { Button } from "@/components/ui/button";
    <Button variant="outline">Click Me</Button>
    ```

### 4. Internationalization (i18n)
All text content is managed via `next-intl`.
- **Dictionary:** `frontend/messages/en.json` (and `hi.json`).
- **Usage:**
    ```tsx
    const t = useTranslations('Dashboard');
    <h1>{t('welcome_message')}</h1>
    ```

---

## Adding a New Page
1.  Create a folder in `app/[locale]/`.
2.  Add a `page.tsx` file.
3.  Ensure server components are default; add `'use client'` directive if you need hooks (`useState`, `useEffect`).

## Docker Optimization
- The project is configured for **Standalone Output** in `next.config.ts`.
- This reduces the Docker image size significantly by only including necessary files for production.
