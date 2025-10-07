## Docker Learning Commands (Project-Focused)

Notes:
- Windows PowerShell preferred here. Where Linux-only commands are shown, they’re marked as Linux.
- Replace placeholders like <EC2_PUBLIC_IP> and <key>.pem as needed.

### Phase 0 – Fundamentals

PowerShell:
```
docker version
docker info
docker system df

# Run a simple web server to observe
docker run -d --name test-nginx nginx
docker stats --no-stream

# Inspect image layers (Linux friendly output)
docker history nginx

# Real-time events (Ctrl+C to stop)
docker events

# Cleanup
docker rm -f test-nginx 2>$null
```

Linux-only examples (if needed):
```
docker exec -it test-nginx ps aux
```

### Phase 1 – Container Lifecycle (using this project)

```
# Clean up stale containers
docker container prune -f

# Backend: open interactive Node container with project mounted
docker run -it --name todo-backend -v ${PWD}/backend:/app -w /app node:18 bash
# Inside container:
# npm install
# exit

# Lifecycle controls (host)
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.State}}"
docker start todo-backend
docker pause todo-backend
docker unpause todo-backend
docker stop todo-backend
docker rm todo-backend

# Exec into running container
docker exec -it <container_name> bash

# Logs and stats
docker logs <container_name>
docker stats --no-stream <container_name>
```

### Phase 2 – Dockerfiles (build reusable images)

Backend (from backend/):
```
docker build -t todo-backend .
```

Frontend (from frontend/):
```
docker build -t todo-frontend .
```

Run images:
```
docker run -d --name todo-backend-running -p 5000:5000 todo-backend
docker run -d --name todo-frontend-running -p 3000:3000 todo-frontend
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Phase 3 – Database Integration (MongoDB + Networking)

Basic MongoDB container:
```
docker run -d --name todo-mongo -p 27017:27017 mongo:latest
docker exec -it todo-mongo mongosh --eval "db.adminCommand('ping')"
```

Connect backend to Mongo (simple link, for learning):
```
docker run -d --name todo-backend-connected \
  --link todo-mongo:mongo \
  -e MONGODB_URI=mongodb://mongo:27017/todoapp \
  -p 5001:5000 \
  todo-backend

docker logs todo-backend-connected
```

Custom network (preferred over --link):
```
docker network create todo-network
docker rm -f todo-backend-connected todo-mongo 2>$null

docker run -d --name todo-mongo --network todo-network mongo:latest
docker run -d --name todo-backend-connected --network todo-network \
  -e MONGODB_URI=mongodb://todo-mongo:27017/todoapp \
  -p 5001:5000 \
  todo-backend
```

PowerShell API tests:
```
# Health
curl http://localhost:5001/api/health

# Create todo
Invoke-RestMethod -Uri "http://localhost:5001/api/todos" -Method POST -ContentType "application/json" -Body '{"text": "Test todo from docker"}'

# List todos
curl http://localhost:5001/api/todos

# Verify in Mongo
docker exec -it todo-mongo mongosh todoapp --eval "db.todos.find()"
```

Port/name conflicts (common fixes):
```
docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
docker rm -f todo-backend todo-backend-running todo-backend-connected todo-frontend-running 2>$null
```

### Phase 4 – Docker Compose (orchestration)

Bring stack up/down:
```
docker compose config -q
docker compose up -d --build
docker compose ps
docker compose logs -f mongo
docker compose logs -f backend
docker compose logs -f frontend
docker compose exec backend sh
docker compose exec mongo mongosh --eval "db.adminCommand('ping')"
docker compose down           # keep data volume
docker compose down -v        # wipe data volume
```

Common compose issues:
```
# Remove legacy containers conflicting with container_name/ports
docker rm -f todo-backend todo-frontend todo-mongo 2>$null
docker compose up -d --force-recreate

# Optional: remove 'version:' key warning by deleting it from docker-compose.yml
```

Optional dev override (hot reload):
```
# docker-compose.override.yml (create alongside docker-compose.yml)
# services:
#   backend:
#     volumes:
#       - ./backend:/app
#       - /app/node_modules
#     command: sh -c "npm install && npx nodemon server.js"
#   frontend:
#     volumes:
#       - ./frontend:/app
#       - /app/node_modules
#     command: sh -c "npm install && npm run dev"

# Then:
docker compose up
```

### Phase 5 – Deploy to EC2 (after Compose works locally)

Local (package & copy):
```
tar -czf todo-stack.tgz backend frontend docker-compose.yml
scp -i <key>.pem todo-stack.tgz ec2-user@<EC2_PUBLIC_IP>:/home/ec2-user/
```

On EC2 (Amazon Linux 2023):
```
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
# re-login or: newgrp docker

# Compose plugin binary (quick install)
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker compose version

cd ~
tar -xzf todo-stack.tgz
cd docker
docker compose up -d --build
docker compose ps
```

Open security group ports temporarily (learning):
- 3000 (frontend), 5000 (backend) to 0.0.0.0/0
- Do NOT expose 27017 publicly (remove Mongo port mapping in production)

Test from laptop:
```
curl http://<EC2_PUBLIC_IP>:5000/api/health
curl http://<EC2_PUBLIC_IP>:3000
```

Operational on EC2:
```
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
docker compose up -d --build
docker compose restart backend
docker compose down
docker compose down -v
```

### Phase 6 – Dev Workflow (Hot Reload via Compose Override)

Create `docker-compose.override.yml` next to `docker-compose.yml` (example):
```
services:
  backend:
    environment:
      - NODE_ENV=development
      - PORT=5000
      - MONGODB_URI=mongodb://mongo:27017/todoapp
      - CHOKIDAR_USEPOLLING=true
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: sh -c "npm install && npx nodemon server.js"
    restart: unless-stopped

  frontend:
    environment:
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
      # - NEXT_PUBLIC_API_BASE=http://localhost:5000
      - CHOKIDAR_USEPOLLING=true
      # - WATCHPACK_POLLING=true
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev"
    restart: unless-stopped
```

Run dev stack:
```
docker compose up
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

Fast rebuilds:
```
docker compose build backend && docker compose up -d backend
docker compose build frontend && docker compose up -d frontend
```

Reset state:
```
docker compose down          # keep DB
docker compose down -v       # wipe DB data
```

Troubleshooting file watching on Windows:
```
# ensure polling env vars are set as above; if still flaky, add WATCHPACK_POLLING=true to frontend
```

### Phase 7 – Production Optimization & Security

Pin image versions (examples):
```
node:18.20.4-alpine3.19
mongo:6.0.18
```

Rebuild reproducibly:
```
docker compose build --no-cache
docker compose up -d
```

Add restart policies / healthchecks (compose snippet idea):
```
# services:
#   backend:
#     restart: unless-stopped
#     healthcheck:
#       test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
#       interval: 30s
#       timeout: 10s
#       retries: 5
#   mongo:
#     restart: unless-stopped
#     healthcheck:
#       test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
```

Security hardening (commands):
```
# Image scanning
docker scout quickview || docker scan todo-backend
docker scan todo-frontend

# Limit resources (compose `deploy.resources`) – then:
docker compose up -d

# Run as non-root (already in Dockerfiles), enforce at runtime if needed:
docker compose up -d
```

Logging & cleanup:
```
# Tail with timestamps
docker compose logs --timestamps --tail=200 backend

# Prune images/containers (careful in prod)
docker system prune -af
# Volumes are preserved unless you add --volumes
# To wipe app volumes intentionally:
docker compose down -v
```

### Phase 5 – Deploy to EC2 (from GitHub)

Step 1 – Connect to your instance
```
ssh -i <key>.pem ec2-user@<EC2_PUBLIC_IP>
```

Step 2 – Install Docker Engine, Docker Compose (v2 binary), and Git
```
# Update packages
sudo dnf update -y

# Install Docker + Git
sudo dnf install -y docker git

# Start and enable Docker
sudo systemctl enable --now docker

# Allow ec2-user to run docker without sudo
sudo usermod -aG docker ec2-user
# open a new SSH session after this or run: newgrp docker

# Install Docker Compose v2 manually (official binary)
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose 2>/dev/null

# Verify installations (Compose v2 also works via `docker compose`)
docker --version
docker compose version
docker-compose version
git --version
```

Expected output example
```
Docker version 27.x.x, build xxxxxxx
Docker Compose version v2.29.7
git version 2.x.x
```

Step 3 – Clone your GitHub repository
```
cd ~
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
# If private: use SSH or a token
```

Step 4 – Build and Run with Docker Compose
```
# Clean any old containers
docker compose down --remove-orphans

# Build and start everything
docker compose up -d --build

# List running services
docker compose ps
```

Step 5 – Security group + Test from your laptop
- Open your EC2 Security Group temporarily to your IP:
  - TCP 3000 (frontend)
  - TCP 5000 (backend)
- Do NOT expose 27017 (Mongo) publicly.

Test:
```
curl http://<EC2_PUBLIC_IP>:5000/api/health
curl http://<EC2_PUBLIC_IP>:3000
```

Step 6 – Logs & Debugging
```
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
docker compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

Step 7 – Redeploy New Code from GitHub
```
cd ~/<your-repo>
git pull origin main
docker compose down --remove-orphans
docker compose up -d --build
```

Step 8 – Maintenance and Cleanup
```
# Restart a specific service
docker compose restart backend

# Remove stopped containers, unused images
docker system prune -af
# Note: volumes are NOT removed unless you add --volumes (data loss!)
# To wipe project volumes intentionally:
# docker compose down -v
```

### Troubleshooting Snippets

```
# Port already allocated
docker ps --format "table {{.Names}}\t{{.Ports}}"
docker rm -f <conflicting_container>

# Name already in use
docker ps -a --filter "name=<name>" --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
docker rm -f <name>

# Backend health
curl http://localhost:5000/api/health
curl http://localhost:5001/api/health

# Mongo ping
docker exec -it todo-mongo mongosh --eval "db.adminCommand('ping')"
```


