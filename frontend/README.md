# Nagar Sewak

## Overview

Nagar Sewak is a **civic engagement platform** that enables citizens to report complaints, view public projects, and interact with local governance. The application provides:
- A map interface with real‑time data for complaints and projects
- Multi‑language support (English & Hindi) using `next-intl`
- Role‑based dashboards for Citizens, Contractors, and Admins
- Admin ability to create contractor accounts via a UI modal
- Premium UI/UX with glass‑morphism, gradients, and smooth animations

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, React‑Leaflet, `next-intl`
- **Backend**: Spring Boot 3.5.7, Java 21, PostgreSQL, Spring Security (JWT)
- **Database**: PostgreSQL

## Getting Started

### Prerequisites
- Node.js ≥ 20
- Java 21
- Maven
- PostgreSQL instance (configure in `backend/src/main/resources/application.properties`)

### Run the Backend
```bash
cd backend
mvn spring-boot:run
```
The API will be available at **http://localhost:8080**.

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at **http://localhost:3000**.

## Features
- **Map**: Browse complaints and projects, filter by status, severity, etc.
- **Language Switcher**: Click the globe icon to toggle English/Hindi.
- **Admin Dashboard**: Analytics, flagged contractors, and a *Create Contractor Account* modal.
- **Citizen Dashboard**: Submit complaints with photo evidence, track status, and rate completed projects.
- **Contractor Dashboard**: View assigned projects and linked complaints.

## Deployment
See `PRODUCTION_READY.md` for a full production checklist and deployment instructions.

## License
This project is open‑source. See the LICENSE file for details.
