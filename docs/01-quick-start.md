# Quick Start Guide - NagarSewak

Welcome to the **NagarSewak** project! This guide will help you get the application up and running on your local machine quickly.

## Prerequisites

Before starting, ensure you have the following installed:

- **Docker Desktop** (Recommended for easiest setup)
- **Node.js** (v18 or higher) - *Only for manual frontend setup*
- **Java Development Kit (JDK) 21** - *Only for manual backend setup*
- **Maven** - *Only for manual backend setup*
- **MySQL 8.0** - *Only for manual database setup*

---

## Method 1: Docker (Recommended) 🐳

The easiest way to run the entire stack (Frontend + Backend + Database) is using Docker Compose.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nagar-sewak
    ```

2.  **Configure Environment:**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    *Note: The default values in `.env` are pre-configured to work with Docker. You usually don't need to change them for local testing.*

3.  **Build and Run:**
    Run the following command in the root directory:
    ```bash
    docker-compose up --build
    ```

4.  **Access the Application:**
    - **Frontend (Citizen App):** [http://localhost:3000](http://localhost:3000)
    - **Backend API:** [http://localhost:8080](http://localhost:8080)
    - **Database:** Port mapped to `3307` (to avoid conflict with local MySQL).

5.  **Stop the Application:**
    Press `Ctrl + C` or run:
    ```bash
    docker-compose down
    ```

---

## Method 2: Manual Setup 🛠️

If you prefer running services individually for development:

### 1. Database Setup
1.  Install MySQL 8.0.
2.  Create a database named `nagar_sewak_db`.
    ```sql
    CREATE DATABASE nagar_sewak_db;
    ```
3.  Update `backend/src/main/resources/application.properties` with your MySQL credentials if they differ from default (root/root).

### 2. Backend (Spring Boot)
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    The server will start on port `8080`.

### 3. Frontend (Next.js)
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Data Seeding (Credentials) 🔑

The application automatically seeds realistic demo data on startup. You can use these credentials to log in:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Citizen** | `aditya` | `password` |
| **Citizen** | `rohan` | `password` |
| **Contractor** | `urbanbuild` | `password` |
| **Contractor** | `metroworks` | `password` |

---

## Troubleshooting

- **Port Conflicts:** Ensure ports `3000`, `8080`, and `3306` (or `3307` for Docker) are free.
- **Database Connection:** If the backend fails to start, check if MySQL is running and credentials in `application.properties` or `.env` are correct.
- **Frontend API Error:** If the frontend can't fetch data, ensure the backend is running and `NEXT_PUBLIC_API_BASE_URL` is set correctly.
