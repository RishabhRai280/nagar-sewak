# 🚀 Quick Start Guide - Nagar Sewak

## Start the Application

### 1. Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```
✅ Backend runs on: **http://localhost:8080**

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: **http://localhost:3000**

## Access the Application

### Public Pages
- **Home**: http://localhost:3000/en
- **Map**: http://localhost:3000/en/map
- **Login**: http://localhost:3000/en/login
- **Register**: http://localhost:3000/en/register

### Authenticated Pages
- **Citizen Dashboard**: http://localhost:3000/en/dashboard/citizen
- **Admin Dashboard**: http://localhost:3000/en/dashboard/admin
- **Contractor Dashboard**: http://localhost:3000/en/dashboard/contractor

## Language Switching
- Click the **globe icon** (🌐) in the header
- Select **English** or **हिंदी**
- URL changes to `/en/` or `/hi/`

## Admin Features

### Create Contractor Account
1. Login as Admin
2. Go to Admin Dashboard
3. Click **"Create Contractor Account"** button
4. Fill in the form:
   - Username
   - Email
   - Full Name
   - Password
   - Company Name
   - License Number
5. Click **"Create Contractor"**
6. Contractor can now login with the credentials

## API Endpoints

### Authentication
```bash
# Register Citizen
POST http://localhost:8080/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "password123"
}

# Login
POST http://localhost:8080/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Admin - Create Contractor
```bash
POST http://localhost:8080/admin/contractors
Authorization: Bearer <admin_jwt_token>
{
  "username": "contractor1",
  "email": "contractor@example.com",
  "fullName": "ABC Construction",
  "password": "secure123",
  "companyName": "ABC Construction Ltd",
  "licenseNo": "LIC-2024-12345"
}
```

## Troubleshooting

### Backend won't start - Port 8080 in use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Then restart
mvn spring-boot:run
```

### Frontend won't start - Port 3000 in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
npm run dev
```

### Database Connection Issues
Check `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nagar_sewak
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Features Overview

### ✅ Citizen Features
- Report complaints with GPS location
- Upload photo evidence
- Track complaint status
- View public projects on map
- Rate completed projects
- Switch language (English/Hindi)

### ✅ Admin Features
- View dashboard analytics
- Monitor all complaints
- Track project status
- View ward hotspots
- **Create contractor accounts** 🆕
- Manage flagged contractors

### ✅ Contractor Features
- View assigned projects
- Track linked complaints
- Monitor ratings
- Update project status

## Tech Stack

**Frontend**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion, React Leaflet, next-intl
**Backend**: Spring Boot 3.5.7, Java 21, PostgreSQL, Spring Security, JWT
**Database**: PostgreSQL 9.2+

## Production Deployment

See `PRODUCTION_READY.md` for complete deployment guide.

---

**Need Help?** Check `PRODUCTION_READY.md` for detailed documentation.
