# Deployment Guide

## Docker Deployment (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Steps

1. Clone the repository:
```bash
git clone https://github.com/jmenichole/Rate-My-Client.git
cd Rate-My-Client
```

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:5000

### Stop the application:
```bash
docker-compose down
```

## Manual Deployment

### Backend Deployment

#### On Ubuntu/Debian Server

1. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Clone and setup:
```bash
git clone https://github.com/jmenichole/Rate-My-Client.git
cd Rate-My-Client/backend
npm install --production
```

3. Create production environment file:
```bash
cat > .env << EOF
PORT=5000
NODE_ENV=production
EOF
```

4. Install PM2 for process management:
```bash
sudo npm install -g pm2
```

5. Start the backend:
```bash
pm2 start server.js --name rate-my-client-api
pm2 save
pm2 startup
```

### Frontend Deployment

#### Option 1: GitHub Pages (Recommended for Frontend-Only Demo)

GitHub Pages is automatically configured for this repository. The frontend is deployed to GitHub Pages on every push to the `main` branch.

**Live URL**: https://jmenichole.github.io/Rate-My-Client/

**Automatic Deployment:**
- Pushes to the `main` branch trigger automatic deployment via GitHub Actions
- The workflow builds the frontend and deploys to GitHub Pages
- No manual steps required once set up

**Manual Deployment:**
1. Ensure GitHub Pages is enabled in repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions

2. Push changes to the `main` branch:
```bash
git push origin main
```

3. Monitor deployment progress in the Actions tab

**Note**: GitHub Pages deployment is frontend-only. For full functionality including backend API features, you'll need to deploy the backend separately (see Backend Deployment section).

#### Option 2: Static Hosting (Netlify, Vercel)

1. Build the frontend:
```bash
cd frontend
npm install
npm run build
```

2. Deploy the `dist` folder to your hosting provider.

3. Configure environment variable:
   - Set `VITE_API_URL` to your backend API URL

#### Option 3: Self-hosted with Nginx

1. Build the frontend:
```bash
cd frontend
npm install
npm run build
```

2. Install Nginx:
```bash
sudo apt-get update
sudo apt-get install nginx
```

3. Copy build files:
```bash
sudo cp -r dist/* /var/www/html/
```

4. Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. Restart Nginx:
```bash
sudo systemctl restart nginx
```

## Cloud Platform Deployment

### Heroku

#### Backend
```bash
cd backend
heroku create your-app-name-api
git subtree push --prefix backend heroku main
```

#### Frontend
```bash
cd frontend
# Add build configuration in package.json
heroku create your-app-name
heroku buildpacks:set heroku/nodejs
git subtree push --prefix frontend heroku main
```

### AWS EC2

1. Launch an EC2 instance (Ubuntu 20.04 recommended)
2. SSH into your instance
3. Follow the manual deployment steps above
4. Configure security groups to allow ports 80 and 5000

### DigitalOcean

1. Create a Droplet (Ubuntu 20.04)
2. Follow the manual deployment steps above
3. Configure firewall to allow HTTP/HTTPS traffic

## Database Configuration

### Production Database Setup

For production, consider using PostgreSQL instead of SQLite:

1. Install PostgreSQL:
```bash
sudo apt-get install postgresql postgresql-contrib
```

2. Create database:
```bash
sudo -u postgres psql
CREATE DATABASE ratemyclient;
CREATE USER ratemyclient_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ratemyclient TO ratemyclient_user;
```

3. Update backend to use PostgreSQL (requires code changes to use `pg` instead of `sqlite3`)

## Environment Variables

### Backend Production .env
```
PORT=5000
NODE_ENV=production
DATABASE_URL=your_database_url_here (if using PostgreSQL)
```

### Frontend Production .env
```
VITE_API_URL=https://your-api-domain.com/api
```

## SSL/HTTPS Configuration

### Using Let's Encrypt with Certbot

1. Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

3. Auto-renewal is configured automatically

## Monitoring and Logs

### View PM2 Logs
```bash
pm2 logs rate-my-client-api
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Backup

### Database Backup
```bash
# SQLite
cp backend/ratemyclient.db backup/ratemyclient_$(date +%Y%m%d).db

# PostgreSQL
pg_dump ratemyclient > backup/ratemyclient_$(date +%Y%m%d).sql
```

## Performance Optimization

1. Enable gzip compression in Nginx
2. Set up a CDN for static assets
3. Implement Redis for caching (optional)
4. Use a load balancer for high traffic

## Security Checklist

- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly (don't allow all origins in production)
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Implement input validation
- [ ] Set up firewall rules
- [ ] Use environment variables for sensitive data
- [ ] Regular database backups

## Troubleshooting

### Backend not starting
- Check PM2 logs: `pm2 logs`
- Verify port is not in use: `sudo lsof -i :5000`

### Frontend not loading
- Check Nginx configuration: `sudo nginx -t`
- View Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### API requests failing
- Verify backend is running
- Check CORS configuration
- Verify API_URL in frontend environment variables
