# NagarSewak (नगर सेवक) 🏙️

**NagarSewak** is a comprehensive civic engagement platform designed to bridge the gap between Citizens, Government Authorities, and Contractors. It enables transparent complaint reporting, tender management, and infrastructure project tracking.

## 🚀 Quick Start
For detailed setup instructions, please refer to the **[Quick Start Guide](docs/01-quick-start.md)**.
You can run the entire stack using Docker:

```bash
docker-compose up --build
```

---

## 📚 Documentation
We have detailed documentation located in the `docs/` directory:

- 🐳 **[Quick Start Guide](docs/01-quick-start.md)**: Setup instructions for Docker and Manual installation.
- 🏗️ **[Architecture Overview](docs/02-architecture.md)**: System design, tech stack (Next.js + Spring Boot), and directory structure.
- 🛡️ **[Backend API Guide](docs/03-backend-api.md)**: authentication flow, API endpoints, and configuration.
- 💻 **[Frontend Developer Guide](docs/04-frontend-guide.md)**: Component structure, state management, and styling.
- 🌐 **[Deployment Guide](docs/05-deployment.md)**: Production setup, Nginx config, and scaling.
- ☁️ **[AWS Free Tier Hosting](docs/07-aws-hosting-guide.md)**: Host everything for $0 using EC2 t2.micro.
- 🎙️ **[Pitch & Speech Script](docs/08-project-pitch.md)**: A structured speech for investors and hackathons.
- 📖 **[User Manual](docs/06-user-manual.md)**: Usage guides for Citizens, Admins, and Contractors.

---

## 🌟 Key Features

### For Citizens
- **Report Issues:** Post complaints with photos and location about civic issues (potholes, garbage, etc.).
- **Track Progress:** See real-time updates on projects in your ward.
- **Vote & Engage:** Upvote critical issues to bring them to attention.

### For Contractors
- **Find Work:** View and bid on open tenders for civic works.
- **Update Status:** Upload milestones and progress photos for assigned projects.

### For Administrators
- **Manage Operations:** Review complaints, create tenders, and accept bids.
- **Monitor:** Dashboard with analytics on resolution times and project status.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Spring Boot 3, Java 21, Hibernate, Spring Security
- **Database:** MySQL 8.0, Redis (Caching)
- **Infrastructure:** Docker, Firebase (Notifications)

## 📄 License
This project is licensed under the MIT License.
