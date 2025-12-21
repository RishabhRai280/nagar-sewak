# Architecture Overview - NagarSewak

## System Design
NagarSewak follows a modern **Microservices-ready** architecture, currently implemented as a robust Monolithic Backend API paired with a Next.js Frontend.

### High-Level Diagram
```mermaid
graph TD
    User[User (Browser/Mobile)] -->|HTTP/HTTPS| Frontend[Next.js Frontend]
    Frontend -->|REST API| Backend[Spring Boot Backend]
    
    subgraph "Data Layer"
        Backend -->|JDBC| MySQL[(MySQL Database)]
        Backend -->|Jedis| Redis[(Redis Cache)]
    end
    
    subgraph "External Services"
        Backend -->|SDK| Firebase[Firebase (FCM)]
        Backend -->|SMTP| Email[Email Service]
    end
```

---

## Technology Stack

### Frontend 💻
- **Framework:** [Next.js 14](https://nextjs.org/) (React framework for production)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** React Context + Custom Stores (`UserStore`)
- **Maps:** Leaflet / React-Leaflet
- **Internationalization:** `next-intl` (English/Hindi support)

### Backend 🛡️
- **Framework:** Spring Boot 3.2
- **Language:** Java 21 LTS
- **Build Tool:** Maven
- **Security:** Spring Security + JWT Authentication
- **Database:** MySQL 8.0
- **ORM:** Hibernate / Spring Data JPA
- **Caching:** Redis (Spring Data Redis)
- **Rate Limiting:** Bucket4j
- **Notifications:** Firebase Admin SDK

### DevOps & Infrastructure 🚀
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions (Planned)

---

## Directory Structure

### Root Directory
```
nagar-sewak/
├── backend/            # Spring Boot Application
├── frontend/           # Next.js Application
├── docs/              # Project Documentation
├── docker-compose.yml # Docker Orchestration
├── .env.example       # Environment Configuration Template
└── README.md          # Project Entry Point
```

### Backend Structure (`backend/src/main/java/...`)
- `config/`: Configuration classes (Security, WebMvc, Swagger).
- `controllers/`: REST API Endpoints.
- `services/`: Business Logic Layer.
- `repositories/`: Data Access Layer (JPA Interfaces).
- `entities/`: Database Models (Hibernate).
- `dtos/`: Data Transfer Objects for API requests/responses.
- `exceptions/`: Global Exception Handling.

### Frontend Structure (`frontend/`)
- `app/`: Next.js App Router (Pages & Layouts).
    - `[locale]/`: Internationalized routes.
    - `dashboard/`: Protected Dashboard routes.
- `components/`: Reusable UI Components.
    - `ui/`: Shadcn UI primitives.
    - `complaints/`: Complaint-specific components.
    - `projects/`: Project tracking components.
- `lib/`: Utilities and API Clients.
    - `api/`: Centralized API calls.
- `messages/`: Localization JSON files used by `next-intl`.

---

## Key Design Decisions

1.  **UserStore Setup:**
    - To avoid prop drilling and excessive API calls, user profile data is cached in a client-side `UserStore` (LocalStorage abstraction) after login.
    - **Pros:** Faster UI loads, persistent session across tabs.
    - **Cons:** Must be manually cleared on logout (handled in `Navbar`).

2.  **Environment Variables:**
    - `NEXT_PUBLIC_API_BASE_URL`: Defined in `frontend/lib/api/api.ts`.
    - Allows the frontend to point to `localhost:8080` in dev or an IP/Domain in production/Docker.

3.  **Role-Based Access Control (RBAC):**
    - **Backend:** `SecurityConfig.java` enforces URL-based permission patterns (e.g., `/admin/**`).
    - **Frontend:** Dashboard routes are segmented (`/dashboard/admin`, `/dashboard/citizen`) and protected by `RoleGuard` components.
