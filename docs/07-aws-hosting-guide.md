# AWS Free Tier Hosting Guide (Minimal Cost) ☁️

This guide explains how to host the **entire** NagarSewak stack (Frontend, Backend, Database) on a single **AWS EC2 t2.micro** instance (Free Tier eligible) for **$0/month** (for the first year).

> **⚠️ WARNING:** A `t2.micro` instance only has **1GB RAM**. Java (Spring Boot) and MySQL are memory-intensive. To make this work, we **MUST** configure "Swap Memory" (using disk space as RAM) and limit resource usage.

---

## 1. Launch EC2 Instance 🚀

1.  Login to **AWS Console** > **EC2** > **Launch Instance**.
2.  **Name:** `nagar-sewak-server`.
3.  **AMI:** Ubuntu Server 24.04 LTS (HVM).
4.  **Instance Type:** `t2.micro` (Variable, Free Tier eligible).
5.  **Key Pair:** Create new > Download `.pem` file.
6.  **Network Settings (Security Group):**
    - Allow SSH (Port 22).
    - Allow HTTP (Port 80) - *For Nginx*.
    - Allow HTTPS (Port 443) - *For secure access*.
    - (Optional) Allow Custom TCP 8080/3000 temporarily for testing (not recommended for production).
7.  **Storage:** 30 GB gp3 (Free tier allows up to 30GB).
8.  **Launch!**

---

## 2. Server Setup (SSH) 💻

Connect to your instance:
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<your-ec2-public-ip>
```

### A. Create Swap Space (CRITICAL) 💾
Since we only have 1GB RAM, we need 4GB of swap file to prevent crashes.

```bash
# 1. Create a 4GB swap file
sudo fallocate -l 4G /swapfile

# 2. Set permissions
sudo chmod 600 /swapfile

# 3. Mark as swap
sudo mkswap /swapfile

# 4. Enable swap
sudo swapon /swapfile

# 5. Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Tune swap usage (aggressively use swap to save RAM)
sudo sysctl vm.swappiness=10
```

### B. Install Docker & Compose 🐳

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Add user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 3. Deploy Application 📦

### A. Clone Repository
```bash
git clone https://github.com/RishabhRai280/nagar-sewak.git
cd nagar-sewak
```

### B. Create Production Env
```bash
nano .env
```
Paste your production environment variables (see `docs/05-deployment.md`). ensure `NEXT_PUBLIC_API_BASE_URL` is your `http://<EC2-PUBLIC-IP>` (or domain).

### C. Optimize `docker-compose.yml` for Low RAM
We need to limit Java and MySQL memory usage. Edit the file:
```bash
nano docker-compose.yml
```

**Add these optimizations:**

1.  **Backend (Java):**
    Add environment variable `JAVA_OPTS` to limit heap size.
    ```yaml
    backend:
      environment:
        - JAVA_OPTS=-Xmx256m -Xms256m
    ```

2.  **Database (MySQL):**
    Add command flags to disable performance schema (saves ~400MB RAM).
    ```yaml
    db:
      command: --performance-schema=OFF --innodb-buffer-pool-size=128M
    ```

### D. Build and Run
```bash
docker compose up -d --build
```
*Note: The build might take a while on a t2.micro CPU. Be patient.*

---

## 4. Reverse Proxy with Nginx (Port 80) 🌐
Instead of accessing ports 3000/8080, let's map everything to Port 80.

1.  **Install Nginx:**
    ```bash
    sudo apt install nginx -y
    ```

2.  **Configure Nginx:**
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
    Replace contents with:
    ```nginx
    server {
        listen 80;
        server_name _;  # Or your domain name

        # Frontend
        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Backend API
        location /api {
            proxy_pass http://localhost:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Backend Auth (if root level)
        location /auth {
             proxy_pass http://localhost:8080;
             proxy_set_header Host $host;
        }
    }
    ```

3.  **Restart Nginx:**
    ```bash
    sudo systemctl restart nginx
    ```

---

## 5. Verify ✅
Visit `http://<YOUR-EC2-PUBLIC-IP>` in your browser.
You should see the application running!

## Summary of Costs 💸
- **EC2 (t2.micro):** Free (750 hours/month for 12 months).
- **Storage (30GB):** Free.
- **Data Transfer:** Free (up to 100GB/month).
- **Total:** **$0.00**

*After 1 year, a t2.micro costs ~$8-10/month.*
