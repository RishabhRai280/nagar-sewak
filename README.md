# NagarSewak (नगर सेवक) 🏙️

**NagarSewak** is a comprehensive civic engagement platform designed to bridge the gap between Citizens, Government Authorities, and Contractors. It enables transparent complaint reporting, tender management, and infrastructure project tracking.

---

## 🚀 Quick Deployment

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
*(Note: If port 3306 is busy, use `-p 3307:3306`)*

**3. Access:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)

---

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

---

## 📦 Docker Hub Repositories

| Component | Image Name | Description |
|-----------|------------|-------------|
| **Monolith** | `rishabhrai12/nagar-sewak-monolith` | All-in-one (Frontend, Backend, MySQL) |
| **Backend** | `rishabhrai12/nagar-sewak-backend` | Spring Boot API only |
| **Frontend** | `rishabhrai12/nagar-sewak-frontend` | Next.js UI only |

---

## 🔑 Environment Configuration (.env)

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

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Spring Boot 3, Java 21, Hibernate, Spring Security
- **Database:** MySQL 8.0, Redis (Caching)
- **Infrastructure:** Docker, Kubernetes, Jenkins

## 📚 Documentation
Detailed docs are in the `docs/` directory:
- [Quick Start Guide](docs/01-quick-start.md)
- [Architecture Overview](docs/02-architecture.md)
- [Backend API Guide](docs/03-backend-api.md)
- [Frontend Developer Guide](docs/04-frontend-guide.md)
- [Kubernetes Deployment Guide](docs/09-k8s-deployment.md)

## 📄 License
This project is licensed under the MIT License.

---

## 🔐 Test Users (Pre-Seeded Data)

The system comes pre-loaded with realistic data. You can log in with any of these accounts.  
**Default Password for ALL users:** `password`

### 👮 Administrator
| Role | Username | Email |
|------|----------|-------|
| **Admin** | `admin` | `admin@nagar.gov` |

### 👷 Contractors
| Role | Username | Email | Company |
|------|----------|-------|---------|
| **Contractor** | `urban_build` | `contact@urbanbuild.com` | UrbanBuild Infra Pvt Ltd |
| **Contractor** | `metro_works` | `info@metroworks.in` | MetroWorks Engineering |

### 👤 Citizens
| Role | Username | Email | Name |
|------|----------|-------|------|
| **Citizen** | `citizen_pune_1` | `aditya.kulkarni@example.com` | Aditya Kulkarni |
| **Citizen** | `citizen_mumbai_1` | `rohan.mehta@example.com` | Rohan Mehta |
| **Citizen** | `citizen_delhi_1` | `aman.verma@example.com` | Aman Verma |
| **Citizen** | `citizen_pune_2` | `suresh.patil@example.com` | Suresh Patil |

