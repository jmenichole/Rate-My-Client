# Rate My Client - Development Guide

## Quick Start

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Server runs on http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173

## Testing the API

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Create a Client
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","company":"Acme Inc","industry":"Tech"}'
```

### Submit a Review
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "rating": 2,
    "title": "Poor communication",
    "description": "Client was unresponsive and changed requirements frequently",
    "red_flags": ["Late payments", "Scope creep"],
    "would_work_again": false,
    "payment_promptness": 2,
    "communication_quality": 1,
    "scope_creep_issue": true
  }'
```

### Analyze Job Post
```bash
curl -X POST http://localhost:5000/api/ai/analyze-job-post \
  -H "Content-Type: application/json" \
  -d '{"jobPostText":"Looking for developer willing to work for exposure. Must be available 24/7!"}'
```

## Development Tips

### Backend Hot Reload
The backend uses `nodemon` in dev mode, so changes auto-reload.

### Frontend Hot Reload
Vite provides instant HMR (Hot Module Replacement).

### Database Management
The SQLite database is stored at `backend/ratemyclient.db`.

To reset the database:
```bash
cd backend
rm ratemyclient.db
npm start  # Will recreate tables
```

## Project Scripts

### Backend
- `npm start` - Run production server
- `npm run dev` - Run with nodemon (auto-reload)

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Common Issues

### Port Already in Use
If port 5000 or 5173 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will auto-increment port

### CORS Issues
The backend is configured to accept all origins. For production, update CORS settings in `backend/server.js`.

### Database Locked
If you get a database locked error, ensure only one backend instance is running.

## Adding New Features

### Add a New API Endpoint
1. Create route handler in `backend/routes/`
2. Import in `backend/server.js`
3. Add to service layer in `frontend/src/services/api.js`

### Add a New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in the navbar

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Use a production database (PostgreSQL recommended)
4. Set up process manager (PM2)

### Frontend
1. Build: `npm run build`
2. Serve `dist` folder with nginx/Apache
3. Configure environment variables

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

For production, update `VITE_API_URL` to your deployed backend URL.
