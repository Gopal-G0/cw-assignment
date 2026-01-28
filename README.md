# Smart Library Borrowing System

A full-stack web application for managing book borrowing, cost calculation, and payment tracking among students. Built with Node.js/Express backend and React frontend.


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
pnpm run dev
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

Success indicators:
VITE v5.x.x ready in xxx ms
Local: http://localhost:3000/
Open browser: http://localhost:3000

### 🔌 Connecting Frontend to Backend
The frontend uses Vite's proxy to avoid CORS issues during development:
How it works:

1. Frontend runs on http://localhost:3000
2. Backend runs on http://localhost:5000
3. Frontend calls /api/books → Vite proxy forwards to http://localhost:5000/api/books
4. Browser thinks it's same-origin, avoiding CORS errors

#### Proxy config(vite.config.js):
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  }
}
```

## 🏗️ How The App Works
### Architecture Overview
#### MVC Pattern (Backend):
1. Models: Define data structure (User, Borrow, Payment)

2. Views: API JSON responses

3. Controllers: Handle business logic

4. Routes: Define API endpoints

5. Middleware: Authentication & validation

#### Component-Based (Frontend):

1. Pages: Route-level components (Login, Dashboard, etc.)
2. Components: Reusable UI pieces (Navbar, Loading)
3. Context: Global state management (AuthContext)
4. Services: API communication layer

Data Flow

#### 1. User Registration/Login
1. Frontend sends credentials → Backend validates → Returns JWT
2. Frontend stores JWT in localStorage
3. Subsequent requests include JWT in Authorization header
#### 2. Borrowing a Book
1. User selects book + days → Frontend validates
2. POST /borrow/validate checks: no active borrow, no debt, book available
3. POST /borrow creates record, calculates cost, creates pending payment
4. Book marked unavailable in list
#### 3. Returning a Book
1. User selects return date (mock/simulation)
2. POST /borrows/:id/submit calculates:
3. Base cost: pricePerDay × daysBorrowed
4. Overdue fee: overdueDays × $1/day
5. Updates payment record with total amount
#### 4. Dashboard & History
1. Fetches active borrow, calculates days remaining
2. Sums pending payments for "Total Due"
3. Shows borrow history + payment history

### Key Business Rules
| Rule                   | Implementation                                           |
| ---------------------- | -------------------------------------------------------- |
| **One book at a time** | Compound index on `{userId, status}` with partial filter |
| **Max 14 days**        | Validation middleware rejects >14 days                   |
| **No debt allowed**    | Checks for pending payments OR overdue books             |
| **Cost calculation**   | `pricePerDay × days` (stored in Borrow record)           |
| **Overdue fees**       | `$1 per day` after due date                              |
| **Password security**  | Bcrypt hashing with salt round 12                        |


### API Documentation
Authentication
| Method | Endpoint            | Description             | Auth |
| ------ | ------------------- | ----------------------- | ---- |
| POST   | `/api/auth/signup`  | Register new user       | No   |
| POST   | `/api/auth/login`   | Login user, returns JWT | No   |
| GET    | `/api/auth/profile` | Get current user        | Yes  |

Books
| Method | Endpoint             | Description                      | Auth |
| ------ | -------------------- | -------------------------------- | ---- |
| GET    | `/api/books`         | List all books with availability | Yes  |
| GET    | `/api/books/:bookId` | Get single book details          | Yes  |

Borrowing
| Method | Endpoint                | Description                | Auth |
| ------ | ----------------------- | -------------------------- | ---- |
| POST   | `/api/borrow/validate`  | Check if borrow is allowed | Yes  |
| POST   | `/api/borrow/calculate` | Preview cost calculation   | Yes  |
| POST   | `/api/borrow`           | Create borrow record       | Yes  |
| GET    | `/api/borrow/active`    | Get user's active borrow   | Yes  |

Returns
| Method | Endpoint                        | Description                 | Auth |
| ------ | ------------------------------- | --------------------------- | ---- |
| POST   | `/api/borrows/:borrowId/submit` | Return book, calculate fees | Yes  |

History
| Method | Endpoint                | Description                     | Auth |
| ------ | ----------------------- | ------------------------------- | ---- |
| GET    | `/api/history/borrows`  | Past borrows (Returned/Overdue) | Yes  |
| GET    | `/api/history/payments` | Payment records                 | Yes  |

Dashbaord
| Method | Endpoint                 | Description                     | Auth |
| ------ | ------------------------ | ------------------------------- | ---- |
| GET    | `/api/dashboard/summary` | Stats, active borrow, total due | Yes  |

Request/ Response Example

Login Request:
```JSON
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123"
}
```

Login Response
```JSON
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "6578a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "student@example.com"
    }
  }
}
```
Create Borrow Request
```JSON
POST /api/borrow
{
  "bookId": "B001",
  "days": 7
}
```

Borrow Response
```JSON
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "borrowId": "6578a1b2c3d4e5f6g7h8i9j0",
    "book": {
      "id": "B001",
      "title": "The Great Gatsby"
    },
    "borrowDate": "2024-01-28T10:00:00Z",
    "dueDate": "2024-02-04T10:00:00Z",
    "totalCost": 14.00,
    "status": "Active"
  }
}
```

### Sample Data

Test Account:
```
Email: test@student.com
Password: password123

```

#### Books Available:
- 20 classic books (The Great Gatsby, 1984, etc.)
- Price range: $2-5 per day
- Max borrow: 14 days
- Overdue fee: $1/day

### 🛠️ Technology Stack

#### Backend

- Node.js 18+
- Express.js 4.x
- MongoDB 6.x + Mongoose 8.x
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

#### Frontend

- React 18
- React Router 6
- Axios for HTTP requests
- date-fns for date formatting
- react-icons for UI icons
- react-hot-toast for notifications
- Vite for build tooling