# Rate-My-Client

A fullstack web application that lets freelancers share horror stories and flag red-flag clients anonymously. Features AI-powered analysis to auto-score job posts for red flags like "must be available 24/7" or "exposure."

**🌐 Live Demo**: [https://jmenichole.github.io/Rate-My-Client/](https://jmenichole.github.io/Rate-My-Client/)

> Note: The live demo is frontend-only. Backend features require separate deployment (see [DEPLOYMENT.md](DEPLOYMENT.md)).

## 🎯 Features

- **Anonymous Client Reviews**: Share experiences with clients without revealing your identity
- **Detailed Rating System**: Rate clients on multiple criteria including:
  - Overall satisfaction
  - Payment promptness
  - Communication quality
  - Scope creep issues
- **AI Job Post Analyzer**: Automatically detect red flags in job postings before you apply
- **Client Search**: Browse and search through client reviews
- **Red Flag Tracking**: Tag and track common warning signs

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data persistence
- **RESTful API** architecture
- Rule-based AI for red flag detection

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

## 📁 Project Structure

```
Rate-My-Client/
├── backend/
│   ├── server.js           # Express server setup
│   ├── database.js         # Database initialization
│   ├── routes/
│   │   ├── clients.js      # Client-related endpoints
│   │   ├── reviews.js      # Review CRUD operations
│   │   └── ai.js          # AI analysis endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # React page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jmenichole/Rate-My-Client.git
cd Rate-My-Client
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

## 🔌 API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get a specific client
- `GET /api/clients/search/:query` - Search clients
- `POST /api/clients` - Create a new client
- `GET /api/clients/:id/stats` - Get client statistics

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get a specific review
- `GET /api/reviews/client/:clientId` - Get reviews for a client
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

### AI Analysis
- `POST /api/ai/analyze-job-post` - Analyze a job post for red flags
- `GET /api/ai/scans` - Get scan history

## 🤖 AI Red Flag Detection

The AI analyzer scans job postings for common red flags including:

- **Exposure/Portfolio**: Offering "exposure" instead of payment
- **24/7 Availability**: Unrealistic availability expectations
- **Urgent Deadlines**: Pressure tactics and impossible timelines
- **Low Budget**: Emphasis on minimal cost
- **Unlimited Revisions**: Scope creep indicators
- **Deferred Payment**: Payment based on equity or future success
- **Unpaid Work**: Free or volunteer positions
- **Downplaying Complexity**: Describing complex work as "simple"

Each flag contributes to a risk score (0-100) with recommendations for freelancers.

## 📊 Database Schema

### Clients Table
- `id`: Primary key
- `name`: Client/contact name
- `company`: Company name (optional)
- `industry`: Industry type (optional)
- `created_at`: Timestamp

### Reviews Table
- `id`: Primary key
- `client_id`: Foreign key to clients
- `rating`: Overall rating (1-5)
- `title`: Review title
- `description`: Detailed review
- `red_flags`: JSON array of red flags
- `would_work_again`: Boolean
- `payment_promptness`: Rating (1-5)
- `communication_quality`: Rating (1-5)
- `scope_creep_issue`: Boolean
- `created_at`: Timestamp

### AI Scans Table
- `id`: Primary key
- `job_post_text`: Original job posting
- `red_flag_score`: Calculated score (0-100)
- `detected_flags`: JSON array of detected flags
- `analysis`: JSON object with detailed analysis
- `created_at`: Timestamp

## 🔒 Privacy & Anonymity

All reviews are completely anonymous. We do not collect or store:
- User accounts or login information
- IP addresses
- Personal identifying information
- Email addresses

This ensures freelancers can safely share their experiences without fear of retaliation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

ISC License

## 🙏 Acknowledgments

Built to protect and empower freelancers worldwide. Say no to red flag clients!

---

**Disclaimer**: This platform is for sharing honest experiences. Please be truthful and factual in your reviews.

