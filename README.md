# AI-Based Smart Complaint Management System

A production-ready MERN stack application for registering, tracking, and managing municipal complaints with AI-powered analysis via OpenRouter API.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![AI](https://img.shields.io/badge/AI-OpenRouter-purple)

## Project Overview

Citizens can register complaints, track status, search by location, filter by category, and receive AI-generated priority analysis, department recommendations, summaries, and auto-responses. Admins can manage all complaints, update statuses, delete records, view analytics, export CSV, and manage users.

## Features

### User Features
- User signup & login with JWT authentication
- Register complaints with form validation
- AI complaint analysis (priority, department, summary, auto-response)
- Track complaint status with timeline
- Search complaints by location
- Filter by category
- Personal dashboard with statistics
- File/image attachment upload
- AI chatbot assistant

### Admin Features
- View all complaints
- Update complaint status with timeline notes
- Delete complaints
- Manage users (role change, delete)
- Complaint analytics dashboard
- Export complaints to CSV
- Email notifications (when SMTP configured)

### Security
- bcrypt password hashing
- JWT protected routes
- Helmet, CORS, rate limiting
- Centralized error handling
- Environment variables

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, React Router, Tailwind CSS, Axios, Framer Motion, Lucide React |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| AI | OpenRouter API (`openai/gpt-4o-mini`) |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

## Folder Structure

```
end_sem/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── scripts/
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── hooks/
│       └── utils/
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenRouter API key

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd end_sem

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your values

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP: `0.0.0.0/0` (for development) or specific IPs for production
4. Copy connection string to `MONGODB_URI` in `backend/.env`

### 3. OpenRouter API Setup

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Create an API key
3. Add to `backend/.env`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-...
   OPENROUTER_MODEL=openai/gpt-4o-mini
   ```

### 4. Create Admin User

```bash
cd backend
node scripts/createAdmin.js "Admin Name" admin@example.com yourpassword
```

### 5. Run Locally

```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | development / production |
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `JWT_EXPIRE` | Token expiry (e.g. 7d) |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | AI model (openai/gpt-4o-mini) |
| `CLIENT_URL` | Frontend URL for CORS |
| `SMTP_*` | Optional email configuration |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (http://localhost:5000/api) |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Create complaint |
| GET | `/api/complaints` | List complaints (paginated) |
| GET | `/api/complaints/:id` | Get complaint by ID |
| PUT | `/api/complaints/:id` | Update complaint |
| DELETE | `/api/complaints/:id` | Delete (admin) |
| GET | `/api/complaints/search?location=` | Search by location |
| GET | `/api/complaints/filter?category=` | Filter by category |
| GET | `/api/complaints/analytics` | Analytics (admin) |
| GET | `/api/complaints/export/csv` | Export CSV (admin) |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze` | Analyze complaint |
| POST | `/api/ai/chat` | Chatbot assistant |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

## Deployment

### MongoDB Atlas (Production)
- Use a dedicated database user with strong password
- Restrict IP whitelist to Render/Vercel IPs where possible

### Backend on Render

1. Push code to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Connect repository, set root directory: `backend`
4. Build: `npm install`
5. Start: `npm start`
6. Add environment variables from `.env.example`
7. Set `CLIENT_URL` to your Vercel frontend URL

Or use the included `render.yaml` blueprint.

### Frontend on Vercel

1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set root directory: `frontend`
3. Framework: Vite
4. Add environment variable:
   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```
5. Deploy

`vercel.json` is included for SPA routing.

### GitHub Push

```bash
git init
git add .
git commit -m "Initial commit: Smart Complaint Management System"
git branch -M main
git remote add origin https://github.com/yourusername/smart-complaint.git
git push -u origin main
```

## Screenshots

> Add screenshots of Home, Dashboard, Complaint Form, AI Analysis, and Admin Dashboard after deployment.

| Page | Description |
|------|-------------|
| Home | Landing page with features |
| Dashboard | User complaint overview |
| Register Complaint | Form with AI preview |
| Complaint Details | Status, AI analysis, timeline |
| Admin Dashboard | Analytics and management |

## Future Improvements

- Push notifications (Firebase)
- GIS map integration for locations
- Multi-language support
- SMS alerts
- Department portal with separate logins
- Advanced AI categorization training
- Mobile app (React Native)
- Real-time updates with WebSockets

## License

MIT
