# Deployment Guide

This guide covers how to deploy NagarSewak to a production environment.

## 1. Environment Configuration 🌐

Create a production `.env` file (do not commit this to Git).

```bash
# Database Configuration
DB_USERNAME=nagar_prod_user
DB_PASSWORD=strong_password_here
MYSQL_ROOT_PASSWORD=very_strong_root_password

# JWT Secret (Generate a secure 256-bit key)
# Command to generate: openssl rand -base64 32
JWT_SECRET=generated_secret_key_here

# Email Configuration (e.g., SendGrid, AWS SES, or Gmail)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_api_key

# Frontend API URL
# Must be the public domain of your backend or reverse proxy location
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

---

## 2. Docker Deployment (Recommended) 🚀

We use Multi-stage Docker builds to ensure images are small and secure.

### Step 1: Prepare the Server
Ensure your server (AWS EC2, DigitalOcean Droplet, etc.) has Docker and Docker Compose installed.

### Step 2: Deploy
1.  Copy the project files to the server.
2.  Run the production compose command:
    ```bash
    docker-compose -f docker-compose.yml up -d --build
    ```
3.  The services will start:
    - **Frontend:** Exposed on port `3000`.
    - **Backend:** Exposed on port `8080`.
    - **Database:** Internal network only (mapped to `3307` for debugging if needed).

---

## 3. Reverse Proxy Setup (Nginx) 🛡️

In production, you should not expose ports 3000/8080 directly. Use Nginx as a reverse proxy with SSL (Let's Encrypt).

### Nginx Configuration Example (`/etc/nginx/sites-available/nagarsewak`)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        # Rewrite if your backend expects /api prefix or handle in Spring Boot
        proxy_pass http://localhost:8080/; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 4. Database Backups 💾

Regularly backup your MySQL database.

**Backup Command:**
```bash
docker exec nagar-sewak-db-1 mysqldump -u root -p[ROOT_PASSWORD] nagar_sewak_db > backup_$(date +%F).sql
```

**Restore Command:**
```bash
cat backup.sql | docker exec -i nagar-sewak-db-1 mysql -u root -p[ROOT_PASSWORD] nagar_sewak_db
```

---

## 5. Scaling 📈

- **Frontend:** Can be horizontally scaled behind a load balancer since it's stateless.
- **Backend:** Can be scaled horizontally. Ensure `JWT_SECRET` is consistent across instances.
- **Database:** Use a managed database service (AWS RDS, Google Cloud SQL) for high availability instead of the containerized MySQL for large-scale production.
