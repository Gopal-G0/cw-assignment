# Smart Library Borrowing System

A full-stack web application for managing book borrowing, cost calculation, and payment tracking among students. Built with Node.js/Express backend and React frontend.

## 📁 Project Structure

smart-library/
├── library-backend/          # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/          # Database & constants
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & validation
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   ├── utils/           # Helpers (calculators, formatters)
│   │   ├── app.js           # Express app config
│   │   └── server.js        # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── library-frontend/        # React + Vite
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # Auth context
│   ├── pages/           # Route pages
│   ├── services/        # API calls
│   ├── utils/           # Formatters & validators
│   ├── App.jsx          # Main app
│   ├── main.jsx         # Entry point
│   └── index.css        # Styles
└── package.json


## 🚀 Prerequisites

- **Node.js** v16+ (Download: https://nodejs.org)
- **MongoDB** (Local setup or MongoDB Atlas cloud)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)

## ⚙️ Backend Setup

### 1. Navigate to Backend
```bash
cd library-backend
```

### 2. Install Dependencies
```bash
npm install
```
This installs: Express, Mongoose, JWT, bcrypt, CORS, dotenv, express-validator

### 3. Configure Environment
Create a .env file in library-backend/:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartlibrary
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

For MongoDB Local:
```env
MONGODB_URL=mongodb://localhost:27017
```

### 4. Run Backend
```bash
npm run dev
```
Success Indicators
- "MongoDB Connected: localhost"
- "20 books seeded successfully"
- "Server running on port 3000"

Test the API:
Open browser: http://localhost:5000/health
Should return: {"status": "OK"}

## Frontend Setup

### 1. Navigate to Frontend
```bash
cd smart-library-frontend
```

### 2. Install Dependencies
```bash
npm install
```
This installs: React, React Router, Axios, date-fns, react-icons, react-hot-toast

### 3. Configure API URL
Create .env file in smart-library-frontend/:
```env
VITE_API_URL=http://localhost:3000/api
```

Note: Vite requires VITE_ prefix for env variables.

### 4. Run Frontend
```bash
npm run dev
```