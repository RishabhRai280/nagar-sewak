# Backend API & Development Guide

## Overview
The Backend is a monolithic Spring Boot application exposing a REST API. It handles business logic, authentication, data persistence, and external service integration.

## Base URL
- **Local:** `http://localhost:8080/api` (Some endpoints are root-level like `/auth`, `/complaints`).
- **Production:** `https://your-domain.com`

---

## Authentication & Security 🔐
Authentication is stateless and uses **JWT (JSON Web Tokens)**.

### Auth Flow
1.  **Login:** Client sends `POST /auth/login` with `username` and `password`.
2.  **Token Issue:** Server validates credentials and returns a `jwt` token.
3.  **Protected Requests:** Client includes the token in the header:
    ```
    Authorization: Bearer <your-jwt-token>
    ```

### Role-Based Access
Permissions are enforced in `SecurityConfig.java`:
- **Admin:** Has full access to `/admin/**`.
- **Contractor:** Access to `/tenders/**`, `/dashboard/contractor/**`.
- **Citizen:** Access to `/complaints/**`.
- **Public:** Access to `/auth/**`, `/public/**`.

---

## Key API Modules

### 1. Authentication (`AuthController`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate user and get token. |
| POST | `/auth/register` | Register a new Citizen account. |
| GET | `/auth/me` | Get current user's profile. |

### 2. Complaints (`ComplaintController`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/complaints` | Get all complaints (filterable). |
| POST | `/complaints` | Create a new complaint. |
| GET | `/complaints/{id}` | Get complaint details. |
| PUT | `/complaints/{id}/status` | Update status (Admin only). |
| POST | `/complaints/{id}/vote` | Upvote a complaint. |

### 3. Projects & Tenders
- **Projects:** Manage ongoing infrastructure works.
    - `GET /projects`: List all public projects.
    - `POST /projects/{id}/milestones`: Contractors upload progress photos.
- **Tenders:** Open bidding process for complaints requiring work.
    - `GET /tenders/open`: List active tenders.
    - `POST /tenders/{id}/bid`: Contractors submit a bid.
    - `POST /tenders/{id}/accept`: Admins accept a bid.

---

## Configuration (`application.properties`)

Important settings located in `src/main/resources/application.properties`:

```properties
# standardspring.datasource.url=jdbc:mysql://localhost:3306/nagar_sewak_db
spring.datasource.username=root
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000

# Firebase (Notifications)
firebase.config.path=classpath:firebase-service-account.json

# Redis (Caching)
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

## Data Seeding 3🌱
The `DataSeeder.java` class runs on startup. It checks if the database is empty and populates it with:
- Default Admin/Citizen/Contractor users.
- Sample Wards in different cities.
- Demo Projects and Complaints with images.

## Common Issues
- **CORS Error:** If frontend is blocked, check `WebMvcConfig.java` to ensure `http://localhost:3000` is allowed.
- **Image Upload:** Images are stored locally in the `uploads/` directory. Ensure permissions allow writing to this folder.
