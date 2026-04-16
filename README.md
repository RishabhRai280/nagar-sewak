<div align="center">

# NagarSewak (नगर सेवक) 🏙️

### Transparent Civic Engagement Platform

Bridge the gap between Citizens, Government Authorities, and Contractors through transparent complaint reporting, tender management, and infrastructure project tracking.

<br />

**Co-developed by Ranjeet Choudhary & Rishabh Rai**

[![GitHub](https://img.shields.io/badge/GitHub-Ranjeet-black?style=flat&logo=github)](https://github.com/Chran19) · [![LinkedIn](https://img.shields.io/badge/LinkedIn-Ranjeet-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/ranjeet-choudhary-39a684290/) | [![GitHub](https://img.shields.io/badge/GitHub-Rishabh-black?style=flat&logo=github)](https://github.com/RishabhRai280) · [![LinkedIn](https://img.shields.io/badge/LinkedIn-Rishabh-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/rishabh-rai280/)

</div>

---

> **Note:** This is an open-source civic engagement platform designed for municipalities and urban local bodies.

---

## Overview

NagarSewak is a comprehensive civic engagement platform designed to bridge the gap between Citizens, Government Authorities, and Contractors. It enables transparent complaint reporting, tender management, and infrastructure project tracking with a multi-language interface supporting English and Hindi.

<br />

![Homepage](frontend/public/ScreenShots/Home-Page.png)

<p align="center"><i>NagarSewak Platform Homepage</i></p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Deployment Options](#deployment-options)
- [Configuration](#configuration)
- [Test Users](#test-users)
- [API Reference](#api-reference)
- [Documentation](#documentation)

---

## Key Features

### Citizen Features

| Feature                | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| Complaint Registration | File detailed complaints with location, images, and descriptions     |
| Complaint Tracking     | Monitor complaint status in real-time with updates and notifications |
| Tender Participation   | View and bid on municipal tenders and projects                       |
| Rating & Feedback      | Rate project quality and provide feedback to contractors             |
| Digital Services       | Access public services and apply for permits online                  |

### Government & Admin Features

| Feature               | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| Complaint Management  | Review, assign, and track citizen complaints efficiently          |
| Contractor Management | Manage contractor profiles and performance ratings                |
| Tender Management     | Create, review, and manage tender announcements and bids          |
| Project Tracking      | Monitor infrastructure projects and milestones                    |
| Analytics Dashboard   | View comprehensive reports and metrics on complaints and projects |
| Multi-Ward Support    | Manage multiple wards with dedicated ward-level access            |

### Contractor Features

| Feature            | Description                                              |
| ------------------ | -------------------------------------------------------- |
| Tender Bidding     | Browse and submit bids for available projects            |
| Project Management | Track assigned projects and provide progress updates     |
| Work Verification  | Document completed work with photos and details          |
| Performance Rating | Monitor contractor ratings based on citizen feedback     |
| Communication      | Direct communication channel with government authorities |

---

## Screenshots

### Authentication

<table>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/login.png" alt="Login" />
      <p align="center"><i>User Login</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/register.png" alt="Register" />
      <p align="center"><i>User Registration</i></p>
    </td>
  </tr>
</table>

### Citizen Dashboard

<table>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/citizen-dashboard.png" alt="Citizen Dashboard" />
      <p align="center"><i>Citizen Main Dashboard</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/report issues.png" alt="Report Issues" />
      <p align="center"><i>File Complaint</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/citizen-analytics.png" alt="Analytics" />
      <p align="center"><i>Complaint Analytics</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/citizen-user manual.png" alt="User Manual" />
      <p align="center"><i>Citizen User Guide</i></p>
    </td>
  </tr>
</table>

### Map Features

<table>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Map.png" alt="Map Overview" />
      <p align="center"><i>Interactive Complaint Map</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Map-feature-1.png" alt="Map Feature 1" />
      <p align="center"><i>Map Heat Layer</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Map-feature-2.png" alt="Map Feature 2" />
      <p align="center"><i>Map Clustering</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Map-feature-3.png" alt="Map Feature 3" />
      <p align="center"><i>Map Markers</i></p>
    </td>
  </tr>
</table>

### Admin Dashboard

<table>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/admin-dashboard.png" alt="Admin Dashboard" />
      <p align="center"><i>Admin Overview</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/complaints -admin side.png" alt="Complaint Management" />
      <p align="center"><i>Complaint Management</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/projects admin side.png" alt="Project Management" />
      <p align="center"><i>Project Management</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/admin-contrac-profiles.png" alt="Contractor Profiles" />
      <p align="center"><i>Contractor Management</i></p>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <img src="frontend/public/ScreenShots/admin-user manual.png" alt="Admin Manual" width="100%" />
      <p align="center"><i>Admin User Guide</i></p>
    </td>
  </tr>
</table>

### Contractor Portal

<table>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Contra-Dashboard.png" alt="Contractor Dashboard" />
      <p align="center"><i>Contractor Dashboard</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Contra-Activeprojects.png" alt="Active Projects" />
      <p align="center"><i>Active Projects</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Contra-Reports.png" alt="Contractor Reports" />
      <p align="center"><i>Project Reports</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Contra-User manual.png" alt="Contractor Manual" />
      <p align="center"><i>Contractor User Guide</i></p>
    </td>
  </tr>
</table>

### Services & Schemes

<table>
  <tr>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Services.png" alt="Services" />
      <p align="center"><i>Civic Services</i></p>
    </td>
    <td width="50%">
      <img src="frontend/public/ScreenShots/Schemes.png" alt="Schemes" />
      <p align="center"><i>Government Schemes</i></p>
    </td>
  </tr>
</table>

---

> **Want to see more?** Deploy the application locally using Docker or Kubernetes and explore all features.

---

## Technology Stack

### Frontend

| Technology                | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| Next.js 14                | React-based SSR web framework                        |
| TypeScript                | Type-safe JavaScript development                     |
| Tailwind CSS              | Utility-first CSS framework                          |
| Shadcn UI                 | React component library                              |
| i18n                      | Multi-language internationalization (English/Hindi)  |
| Progressive Web App (PWA) | Offline functionality and mobile app-like experience |

### Backend

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| Spring Boot 3   | Java web application framework    |
| Java 21         | Programming language              |
| Hibernate/JPA   | Object-relational mapping         |
| Spring Security | Authentication and authorization  |
| JWT             | Secure token-based authentication |
| Spring Data JPA | Database abstraction layer        |

### Services & Infrastructure

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| MySQL 8.0        | Relational database                  |
| Redis            | Caching and performance optimization |
| Docker           | Containerization                     |
| Kubernetes (k8s) | Container orchestration              |
| Jenkins          | CI/CD pipeline                       |

---

## Architecture

```
NagarSewak/
│
├── frontend/                # Next.js React application
│   ├── app/                 # App router and page components
│   │   ├── [locale]/        # Locale-specific pages
│   │   ├── api/             # API routes
│   │   └── components/      # Reusable React components
│   ├── lib/                 # Utility functions and helpers
│   ├── messages/            # i18n translations
│   └── public/              # Static assets
│
├── backend/                 # Spring Boot Java backend
│   ├── src/
│   │   ├── main/java/       # Source code
│   │   │   └── com/         # Main packages
│   │   └── resources/       # Configuration files
│   ├── pom.xml              # Maven dependencies
│   └── Dockerfile           # Backend container definition
│
├── k8s/                     # Kubernetes configuration
│   ├── deployment.yaml      # K8s deployment configuration
│   ├── service.yaml         # K8s service definition
│   └── config.yaml          # K8s config maps
│
├── docs/                    # Project documentation
│   ├── 01-quick-start.md    # Quick start guide
│   ├── 02-architecture.md   # Architecture details
│   ├── 03-backend-api.md    # Backend API reference
│   ├── 04-frontend-guide.md # Frontend developer guide
│   ├── 05-deployment.md     # Deployment instructions
│   ├── 09-k8s-deployment.md # Kubernetes deployment
│   └── ...
│
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile.merged        # Monolith Dockerfile
├── Jenkinsfile              # CI/CD pipeline
└── README.md                # This file
```

---

## Getting Started

### Prerequisites

- **Docker** (v20.10+) - For containerized deployment
- **Docker Desktop** or **Minikube** - For Kubernetes support
- **Git** - For cloning the repository
- **Node.js** (v18+) - For local frontend development
- **Java 21** - For local backend development
- **Maven** (v3.8+) - For building Java backend

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Chran19/nagar-sewak.git
cd nagar-sewak
```

2. **Create environment configuration**

Create a `.env` file in the root directory (see [Configuration](#configuration) section below)

3. **Choose your deployment method** and follow the instructions in the [Deployment Options](#deployment-options) section

---

## 🚀 Deployment Options

## 🚀 Deployment Options

### 🐳 Option 1: Docker (Easiest)

We have pre-built images on Docker Hub that support both **Windows (AMD64)** and **Mac (ARM64)**.

**1. Pull the Monolith Image (Frontend + Backend + DB):**

```bash
docker pull rishabhrai12/nagar-sewak-monolith:latest
```

**2. Run the Application:**

```bash
docker run -p 3000:3000 -p 8080:8080 -p 3306:3306 --env-file .env rishabhrai12/nagar-sewak-monolith:latest
```

_(Note: If port 3306 is busy, use `-p 3307:3306`)_

**3. Access:**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)

### ☸️ Option 2: Kubernetes (k8s)

Deploy to Minikube or Docker Desktop Kubernetes.

**1. Apply Configuration:**

```bash
kubectl apply -f k8s/
```

**2. Verify:**

```bash
kubectl get pods
kubectl get services
```

**3. Access:**

- **Docker Desktop**: [http://localhost:30000](http://localhost:30000)
- **Minikube**: Run `minikube ip` and access port `30000` on that IP.

### 📦 Docker Hub Repositories

| Component    | Image Name                          | Description                           |
| ------------ | ----------------------------------- | ------------------------------------- |
| **Monolith** | `rishabhrai12/nagar-sewak-monolith` | All-in-one (Frontend, Backend, MySQL) |
| **Backend**  | `rishabhrai12/nagar-sewak-backend`  | Spring Boot API only                  |
| **Frontend** | `rishabhrai12/nagar-sewak-frontend` | Next.js UI only                       |

---

## 🔑 Configuration

## 🔑 Configuration

### Environment Variables (.env)

Create a file named `.env` in the root directory with the following content:

```properties
# --- Database Configuration ---
# Must match the internal Monolith DB credentials
DB_USERNAME=root
DB_PASSWORD=root@123
MYSQL_ROOT_PASSWORD=root@123
MYSQL_DATABASE=nagar_sewak_db

# --- Backend Configuration ---
JWT_SECRET=mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForSecurity

# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# --- Frontend Configuration ---
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# --- Firebase (Optional) ---
FIREBASE_CREDENTIALS_PATH=/app/firebase-service-account.json
```

---

## 🔐 Test Users

### Pre-Seeded Data

The system comes pre-loaded with realistic data. You can log in with any of these accounts.  
**Default Password for ALL users:** `password`

### 👮 Administrator

| Role      | Username | Email             |
| --------- | -------- | ----------------- |
| **Admin** | `admin`  | `admin@nagar.gov` |

### 👷 Contractors

| Role           | Username      | Email                    | Company                  |
| -------------- | ------------- | ------------------------ | ------------------------ |
| **Contractor** | `urban_build` | `contact@urbanbuild.com` | UrbanBuild Infra Pvt Ltd |
| **Contractor** | `metro_works` | `info@metroworks.in`     | MetroWorks Engineering   |

### 👤 Citizens

| Role        | Username           | Email                         | Name            |
| ----------- | ------------------ | ----------------------------- | --------------- |
| **Citizen** | `citizen_pune_1`   | `aditya.kulkarni@example.com` | Aditya Kulkarni |
| **Citizen** | `citizen_mumbai_1` | `rohan.mehta@example.com`     | Rohan Mehta     |
| **Citizen** | `citizen_delhi_1`  | `aman.verma@example.com`      | Aman Verma      |
| **Citizen** | `citizen_pune_2`   | `suresh.patil@example.com`    | Suresh Patil    |

---

## 📚 API Reference

### Complaints Endpoint

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/api/complaints`     | [Get all complaints or filtered list] |
| GET    | `/api/complaints/:id` | [Get complaint details by ID]         |
| POST   | `/api/complaints`     | [Create a new complaint]              |
| PUT    | `/api/complaints/:id` | [Update complaint status/details]     |
| DELETE | `/api/complaints/:id` | [Delete a complaint]                  |

### Tenders Endpoint

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/api/tenders`          | [Get all tenders]     |
| GET    | `/api/tenders/:id`      | [Get tender details]  |
| POST   | `/api/tenders`          | [Create new tender]   |
| PUT    | `/api/tenders/:id`      | [Update tender]       |
| POST   | `/api/tenders/:id/bids` | [Submit a tender bid] |

### Projects Endpoint

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| GET    | `/api/projects`            | [Get all projects]      |
| GET    | `/api/projects/:id`        | [Get project details]   |
| POST   | `/api/projects`            | [Create new project]    |
| PUT    | `/api/projects/:id`        | [Update project]        |
| PUT    | `/api/projects/:id/status` | [Update project status] |

### Authentication Endpoint

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/api/auth/login`         | [User login with credentials] |
| POST   | `/api/auth/register`      | [User registration]           |
| POST   | `/api/auth/logout`        | [User logout]                 |
| POST   | `/api/auth/refresh-token` | [Refresh JWT token]           |

---

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [Quick Start Guide](docs/01-quick-start.md)
- [Architecture Overview](docs/02-architecture.md)
- [Backend API Guide](docs/03-backend-api.md)
- [Frontend Developer Guide](docs/04-frontend-guide.md)
- [Deployment Guide](docs/05-deployment.md)
- [User Manual](docs/06-user-manual.md)
- [AWS Hosting Guide](docs/07-aws-hosting-guide.md)
- [Project Pitch](docs/08-project-pitch.md)
- [Kubernetes Deployment](docs/09-k8s-deployment.md)

---

## 🛠️ Local Development

### Frontend Development

```bash
cd frontend
pnpm install        # Install dependencies
pnpm dev            # Start development server (http://localhost:3000)
pnpm build          # Production build
```

### Backend Development

```bash
cd backend
./mvnw clean install    # Build the project
./mvnw spring-boot:run  # Start Spring Boot server (http://localhost:8080)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/[FEATURE_NAME]`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/[FEATURE_NAME]`)
5. Open a Pull Request

---

## 🔗 Links & Resources

- **GitHub Repository:** [https://github.com/Chran19/nagar-sewak](https://github.com/Chran19/nagar-sewak)
- **Issue Tracker:** [https://github.com/Chran19/nagar-sewak/issues](https://github.com/Chran19/nagar-sewak/issues)
- **Project Discussion:** [discussions on GitHub](https://github.com/Chran19/nagar-sewak/discussions)

---

## 👥 Developers

<div align="center">

### Meet the Team

<table>
  <tr>
    <td width="50%" align="center">
      <h3>Ranjeet Choudhary</h3>
      <p><b>Full-Stack Developer</b></p>
      <p>Architected backend APIs, database design, and deployed infrastructure</p>
      <br />
      <a href="https://github.com/Chran19" target="_blank">
        <img src="https://img.shields.io/badge/GitHub-Chran19-black?style=for-the-badge&logo=github" alt="GitHub" />
      </a>
      <br />
      <a href="https://www.linkedin.com/in/ranjeet-choudhary-39a684290/" target="_blank">
        <img src="https://img.shields.io/badge/LinkedIn-Ranjeet%20Choudhary-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn" />
      </a>
    </td>
    <td width="50%" align="center">
      <h3>Rishabh Rai</h3>
      <p><b>Frontend & Full-Stack Developer</b></p>
      <p>Designed UI/UX, built responsive Next.js frontend, and integrated Firebase</p>
      <br />
      <a href="https://github.com/RishabhRai280" target="_blank">
        <img src="https://img.shields.io/badge/GitHub-RishabhRai280-black?style=for-the-badge&logo=github" alt="GitHub" />
      </a>
      <br />
      <a href="https://www.linkedin.com/in/rishabh-rai280/" target="_blank">
        <img src="https://img.shields.io/badge/LinkedIn-Rishabh%20Rai-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn" />
      </a>
    </td>
  </tr>
</table>

</div>

---

## 👥 Support & Contact

- **Report Issues:** [GitHub Issues](https://github.com/Chran19/nagar-sewak/issues)
- **Request Features:** [GitHub Discussions](https://github.com/Chran19/nagar-sewak/discussions)

---

<div align="center">

**Building transparent municipal governance, one complaint at a time.**

---

**Contributions and feedback are always welcome!**

[Back to Top](#nagarsewak-नगर-सेवक-)

</div>
