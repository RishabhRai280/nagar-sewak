# 🏛️ Nagar Sewak - Civic Engagement Platform

A modern, full-stack civic technology platform that enables citizens to report issues, track municipal projects, and engage with local administration in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

## ✨ Features

### For Citizens
- 📍 **Geo-Tagged Reporting**: Submit complaints with GPS coordinates and photo evidence
- 🗺️ **Interactive Map**: View all complaints and projects on an interactive map with area search
- 📊 **Personal Dashboard**: Track your submitted complaints and their resolution status
- 🔔 **Real-Time Updates**: Get notified about status changes on your reports
- ⭐ **Project Ratings**: Rate completed municipal projects

### For Administrators
- 📈 **Analytics Dashboard**: Comprehensive metrics on complaints, resolutions, and trends
- 👥 **User Management**: Manage citizens, contractors, and administrative staff
- 🎯 **Assignment System**: Assign complaints to appropriate contractors
- 📋 **Status Tracking**: Monitor complaint lifecycle from submission to resolution

### For Contractors
- 📋 **Work Dashboard**: View assigned complaints and linked projects
- 📸 **Progress Updates**: Upload photos and update work status
- 📊 **Performance Metrics**: Track completion rates and average resolution times

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ (for Spring Boot backend)
- **Maven** 3.6+
- **PostgreSQL** 14+ (or your preferred database)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/RishabhRai280/nagar-sewak.git
cd nagar-sewak
```

#### 2. Backend Setup

```bash
cd backend

# Configure database connection
# Edit src/main/resources/application.properties with your database credentials

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local and set:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Maps**: React Leaflet + OpenStreetMap
- **Animations**: Framer Motion
- **State Management**: React Hooks + Local Storage

### Backend Stack
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL (configurable)
- **Authentication**: JWT
- **File Storage**: Local filesystem (configurable for cloud storage)

### Key Features
- 🔐 JWT-based authentication
- 📱 Fully responsive design
- 🗺️ Geographic search with Nominatim API
- 🎨 Premium glassmorphism UI
- ♿ Accessibility-focused (WCAG 2.1 AA)
- 🔄 Real-time data updates
- 📊 Comprehensive analytics

---

## 📁 Project Structure

```
nagar-sewak/
├── frontend/
│   ├── app/
│   │   ├── components/       # Reusable React components
│   │   ├── dashboard/        # Dashboard pages (citizen, admin, contractor)
│   │   ├── map/             # Map feature
│   │   ├── api/             # API routes (geocoding proxy)
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   ├── validation.ts    # Input validation
│   │   └── apiHelpers.ts    # Utility functions
│   └── public/              # Static assets
│
├── backend/
│   ├── src/main/java/
│   │   └── com/nagarsewak/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── model/       # Data models
│   │       └── repository/  # Data access
│   └── src/main/resources/
│       └── application.properties
│
└── PRODUCTION_CHECKLIST.md  # Production readiness guide
```

---

## 🔧 Configuration

### Environment Variables

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

#### Backend (`backend/src/main/resources/application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nagarsewak
spring.datasource.username=your_username
spring.datasource.password=your_password

jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

file.upload-dir=./uploads
```

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests (if configured)
npm run lint          # Run ESLint
```

### Backend
```bash
cd backend
mvn test              # Run unit tests
mvn verify            # Run integration tests
```

---

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build         # Creates optimized production build
npm run start         # Serves production build
```

### Backend
```bash
cd backend
mvn clean package     # Creates JAR file in target/
java -jar target/nagar-sewak-0.0.1-SNAPSHOT.jar
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Secure file upload handling
- ✅ Environment-based configuration
- ⚠️ **TODO**: Implement rate limiting (see PRODUCTION_CHECKLIST.md)
- ⚠️ **TODO**: Add CSRF protection (see PRODUCTION_CHECKLIST.md)

---

## 🗺️ API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Complaints
- `POST /api/complaints` - Submit new complaint (with file upload)
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/{id}` - Get complaint details
- `PUT /api/complaints/{id}/status` - Update complaint status

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects/{id}/rate` - Rate a project

### Map
- `GET /api/map/data` - Get all map markers (complaints + projects)

For complete API documentation, see the backend Swagger UI at `http://localhost:8080/swagger-ui.html` (when configured).

---

## 🎨 Design System

The application uses a custom design system with:
- **Colors**: Blue-based palette with semantic colors for status
- **Typography**: Geist Sans for UI, Geist Mono for code
- **Components**: Glassmorphism cards, smooth animations, premium shadows
- **Spacing**: 8px base unit
- **Breakpoints**: Mobile-first responsive design

---

## 🚀 Deployment

### Frontend (Vercel - Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend (Docker)
```bash
cd backend

# Build Docker image
docker build -t nagar-sewak-backend .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/nagarsewak \
  -e SPRING_DATASOURCE_USERNAME=username \
  -e SPRING_DATASOURCE_PASSWORD=password \
  nagar-sewak-backend
```

---

## 📊 Performance Targets

- ⚡ Page Load Time: < 3 seconds
- 🎯 Lighthouse Score: > 90
- 📱 Mobile Usability: > 90
- ♿ Accessibility: 100% WCAG AA
- 🔄 API Response Time: < 500ms (p95)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenStreetMap for map tiles and Nominatim geocoding
- React Leaflet for map components
- Tailwind CSS for styling utilities
- Framer Motion for animations
- Spring Boot community for backend framework

---

## 📞 Support

For support, email support@nagarsewak.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Mobile apps (iOS & Android)
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with government APIs
- [ ] AI-powered complaint categorization
- [ ] Chatbot for citizen support

---

## 📈 Status

- **Version**: 1.0.0
- **Status**: Beta
- **Last Updated**: November 2025

---

**Made with ❤️ for better civic engagement**
