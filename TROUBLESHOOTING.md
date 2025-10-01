# Troubleshooting Guide

## Issue: Frontend trying to connect to `http://172.16.0.42:3001/` instead of localhost

### Possible Causes & Solutions:

#### 1. **Backend Not Running**
- **Check**: Run `node check-ports.js` to see if port 5000 is available
- **Solution**: Start the backend server
  ```bash
  cd backend
  npm install
  npm run dev
  ```

#### 2. **Frontend Configuration Issue**
- **Check**: Look at browser console for API configuration logs
- **Solution**: The frontend now uses configurable API endpoints

#### 3. **Network Configuration**
- **Check**: If you're on a corporate network or using Docker
- **Solution**: Update the API URL in `frontend/src/config/api.ts`

### Quick Fix Steps:

#### Step 1: Start Backend
```bash
cd backend
npm install
npm run dev
```
Should show: `Server running on port 5000`

#### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Should show: `Ready - started server on 0.0.0.0:3000`

#### Step 3: Check API Configuration
Open browser console and look for:
```
API Configuration:
- API_BASE_URL: http://localhost:5000
- TODOS_ENDPOINT: http://localhost:5000/api/todos
```

### Alternative API URLs:

If localhost doesn't work, try these in `frontend/src/config/api.ts`:

```typescript
// For Docker
const API_BASE_URL = 'http://backend:5000';

// For different port
const API_BASE_URL = 'http://localhost:3001';

// For IP address
const API_BASE_URL = 'http://172.16.0.42:5000';
```

### Environment Variables:

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Common Issues:

1. **CORS Error**: Backend CORS is configured for `http://localhost:3000`
2. **Port Conflict**: Another service using port 5000 or 3000
3. **Network Issue**: Corporate firewall or proxy blocking localhost

### Debug Commands:

```bash
# Check what's running on ports
netstat -an | findstr :5000
netstat -an | findstr :3000

# Test backend directly
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000
```
