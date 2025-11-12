# Installation Guide

Complete step-by-step instructions for installing and running the Fantasy Soccer Dashboard.

---

## Prerequisites

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **RAM**: 2GB
- **Disk Space**: 500MB

### Check Your System
```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version
npm --version
# Should output: 8.0.0 or higher
```

### Optional (for Docker)
- **Docker**: 20.10+
- **Docker Compose**: 1.29+

---

## Installation Methods

## Method 1: Docker (Recommended - Easiest)

### Step 1: Install Docker
- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker for Linux](https://docs.docker.com/engine/install/)

### Step 2: Clone Repository
```bash
git clone https://github.com/sebaterri/cursor.git
cd cursor
```

### Step 3: Run with Docker Compose
```bash
docker-compose up --build
```

### Step 4: Access Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Stop Docker Containers
```bash
docker-compose down
```

---

## Method 2: Local Development

### Step 1: Clone Repository
```bash
git clone https://github.com/sebaterri/cursor.git
cd cursor
```

### Step 2: Install Backend

**Navigate to backend folder:**
```bash
cd backend
```

**Install dependencies:**
```bash
npm install
```

**Environment setup:**
```bash
cp .env.example .env
```

**Edit .env if needed:**
```
PORT=5000
NODE_ENV=development
```

**Start backend server:**
```bash
npm run dev
```

**Expected output:**
```
🚀 Fantasy Soccer API running on http://localhost:5000
📚 GET http://localhost:5000/players - List all players
🔝 GET http://localhost:5000/topPlayers?limit=10 - Top players
❤️ GET http://localhost:5000/health - Health check
```

✅ Backend is now running!

### Step 3: Install Frontend (New Terminal)

**Navigate to frontend folder:**
```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Environment setup:**
```bash
cp .env.example .env
```

**Verify .env:**
```
REACT_APP_API_URL=http://localhost:5000
```

**Start frontend:**
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view fantasy-soccer-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.x.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

✅ Frontend is now running!

### Step 4: Access Application
- Open browser: http://localhost:3000
- Backend API: http://localhost:5000

---

## Build for Production

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
```

The `build/` folder contains optimized production files ready for deployment.

---

## Troubleshooting Installation

### Problem: "npm: command not found"
**Solution:** Node.js not installed or not in PATH
```bash
# Reinstall Node.js from nodejs.org
# Then restart terminal
```

### Problem: Port 5000 already in use
**Linux/Mac:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process (replace PID)
kill -9 <PID>
```

**Windows:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Problem: Port 3000 already in use
Similar steps as above, just use `:3000` instead.

### Problem: Dependencies won't install
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: "Cannot find module" after npm install
```bash
# Ensure you're in the correct directory
cd backend  # or cd frontend

# Reinstall dependencies
npm install

# Try again
npm run dev  # backend
npm start    # frontend
```

### Problem: API connection error on frontend
**Check:**
1. Backend is running on port 5000
2. No firewall blocking localhost:5000
3. `.env` has correct `REACT_APP_API_URL`
4. CORS is enabled in backend

```bash
# Test API manually
curl http://localhost:5000/health

# Should return:
# {"success":true,"status":"OK"}
```

### Problem: "Certificate error" or SSL issues
This shouldn't happen on localhost. If it does:
```bash
# Set environment variable
NODE_TLS_REJECT_UNAUTHORIZED=0 npm start
```

---

## Verify Installation

### Test Backend
```bash
# In new terminal
curl http://localhost:5000/health

# Expected response:
# {"success":true,"status":"OK"}

# Get players
curl http://localhost:5000/players

# Should return JSON with player list
```

### Test Frontend
1. Open http://localhost:3000 in browser
2. You should see the Fantasy Soccer Dashboard
3. Player cards should display with images
4. Search bar should be functional

---

## First Run Checklist

- [ ] Node.js installed (18+)
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Backend running on :5000
- [ ] Frontend dependencies installed
- [ ] Frontend running on :3000
- [ ] Can access http://localhost:3000
- [ ] See player cards displaying
- [ ] Can search and filter players
- [ ] Can add players to team

---

## Next Steps

1. Read [QUICKSTART.md](QUICKSTART.md) - Get started quickly
2. Check [API_EXAMPLES.md](API_EXAMPLES.md) - Test API endpoints
3. Review [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
4. Explore [README.md](README.md) - Full documentation

---

## Additional Help

### Documentation Files
- **README.md** - Complete project documentation
- **QUICKSTART.md** - 5-minute quick start
- **DEVELOPMENT.md** - Development setup & debugging
- **API_EXAMPLES.md** - API endpoint reference
- **PROJECT_SUMMARY.md** - Technical overview

### Common Commands

**Backend:**
```bash
cd backend
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm test         # Run tests
```

**Frontend:**
```bash
cd frontend
npm install      # Install dependencies
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

**Docker:**
```bash
docker-compose up --build      # Build and start
docker-compose down            # Stop containers
docker-compose logs            # View logs
docker-compose logs -f         # Follow logs
```

---

## System Requirements by Method

### Docker Method
- Docker Desktop: 2GB RAM, 5GB disk
- Fast internet (downloading images)
- ~5 minutes total time

### Local Development
- 1GB RAM minimum
- 500MB disk space
- ~10 minutes total time (includes downloads)

---

## Environment Setup Examples

### Backend .env
```
PORT=5000
NODE_ENV=development
```

### Frontend .env
```
REACT_APP_API_URL=http://localhost:5000
```

### Production .env

**Backend:**
```
PORT=5000
NODE_ENV=production
```

**Frontend:**
```
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## Getting Help

1. **Check logs**: Look for error messages in terminal
2. **Verify ports**: Use `lsof` or `netstat` to check
3. **Try fresh install**: Delete node_modules, reinstall
4. **Check documentation**: See files linked above
5. **Open an issue**: GitHub issue tracker

---

## Performance Tips

1. **Use Docker** for consistent environment
2. **Close unnecessary apps** to free RAM
3. **Use `npm ci`** instead of `npm install` for production
4. **Clear cache** if experiencing issues: `npm cache clean --force`

---

**You're all set! 🚀 Start building your fantasy team!**

See [QUICKSTART.md](QUICKSTART.md) for next steps.
