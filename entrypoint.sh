#!/bin/bash

# 1. Start MySQL service
service mysql start

# 2. Wait for MySQL to be ready
echo "Waiting for MySQL..."
until mysqladmin ping >/dev/null 2>&1; do
  sleep 2
done

# 3. Create the database if it doesn't exist
mysql -e "CREATE DATABASE IF NOT EXISTS nagar_sewak_db;"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root@123'; FLUSH PRIVILEGES;"

# 4. Start the Backend (Spring Boot) in the background
echo "Starting Backend..."
java -jar /app/backend/app.jar &

# 5. Start the Frontend (Next.js Standalone)
echo "Starting Frontend..."
cd /app/frontend
HOSTNAME=0.0.0.0 node server.js