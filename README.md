# AI Interview App

An AI-powered fullstack mock interview platform designed to help job seekers practice technical and behavioral interviews. The application generates custom sets of questions based on selected roles and difficulty levels, grades candidates' responses, and provides granular, actionable feedback powered by the **Llama-3.3-70b** model via the **Groq API**.

---

## 🚀 Key Features

* **Secure Authentication**: User sign-up and login flow powered by JWT (JSON Web Tokens) and bcrypt password hashing.
* **Interactive Mock Interviews**:
  * Customizable configurations for role/category (**Frontend**, **Backend**, **Fullstack**, **HR**, **DSA**) and difficulty level (**Easy**, **Medium**, **Hard**).
  * Timed or self-paced response submissions.
* **AI Evaluation Engine**:
  * Real-time answer grading.
  * Marks out of 5 for each answer.
  * Constructive, structured feedback highlighting strengths, weaknesses, and improvement tips.
* **Candidate Dashboard**:
  * Comprehensive overview of past interview sessions.
  * Scoring metrics, response logs, and saved feedback reports.
* **Admin Control Center**:
  * Secure Admin Dashboard accessible only to users with the `admin` role.
  * System-wide statistics (total users, total interviews conducted).
  * User management (view and delete user accounts).
  * View all conducted interviews and details.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework**: React.js (v19)
* **Routing**: React Router DOM (v7)
* **HTTP Client**: Axios
* **Styling**: Vanilla CSS (sleek, modern interface with high visual quality)

### Backend (Server)
* **Runtime Environment**: Node.js
* **Framework**: Express.js (v5)
* **Database**: MongoDB with Mongoose ODM (v9)
* **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
* **AI Integration**: Groq Cloud SDK (running `llama-3.3-70b-versatile`)

---

## 📂 Project Structure

```text
AI-Interview-App/
├── ai-interview-frontend/       # React SPA Frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # Axios clients and configuration
│   │   ├── Components/          # Common components (Navbar, PrivateRoute, etc.)
│   │   ├── Pages/               # Home, Login, Signup, Dashboard, Interview, Result, AdminDashboard
│   │   ├── Services/            # Business logic / API abstraction
│   │   ├── App.js               # Application routing
│   │   └── index.js             # Entry point
│   ├── .env                     # Frontend environment variables
│   └── package.json
│
├── backend/                     # Express API Server
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Authentication and authorization guards
│   ├── models/                  # Mongoose schemas (User, Interview)
│   ├── routes/                  # API endpoints (Auth, Interview, Admin)
│   ├── utils/                   # Helpers
│   ├── server.js                # App entry point
│   ├── .env                     # Backend environment variables
│   └── package.json
│
├── netlify.toml                 # Frontend deployment configuration
└── README.md                    # Main Project Documentation (This file)
```

---

## 🔑 Environment Setup

To run the project locally, you must create and configure `.env` files in both the frontend and backend folders.

### 1. Backend Environment Variables
Create a file named `.env` inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

### 2. Frontend Environment Variables
Create a file named `.env` inside the `ai-interview-frontend/` directory:

```env
REACT_APP_BASE_URL=http://localhost:5000
```
*(For production, update this to your hosted backend API URL).*

---

## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)
* `POST /signup` - Registers a new user.
* `POST /login` - Authenticates user credentials and returns a JWT token.

### 📝 Interview Routes (`/api/interview`)
* `GET /my` - Fetches all mock interviews completed by the authenticated user.
* `GET /sessions` - Lists available interview subjects and statuses.
* `POST /generate` - Generates a set of questions based on the selected role, difficulty, and question count.
* `POST /submit` - Submits a completed interview session. The backend routes the questions and user answers to the Groq API for grading and feedback, then stores the result in MongoDB.

### 🛡️ Admin Routes (`/api/admin`)
* `POST /create-admin` - Development endpoint to create a default admin user.
* `GET /stats` - Retrieves system-wide stats (total users, total interviews). *(Requires Admin JWT)*
* `GET /users` - Fetches all registered user profiles. *(Requires Admin JWT)*
* `DELETE /users/:id` - Deletes a user profile and their associated data. *(Requires Admin JWT)*
* `GET /interviews` - Fetches a list of all interviews conducted across the platform.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/en) installed.
* [MongoDB](https://www.mongodb.com/) (Atlas or local instance) running.
* Groq API Key (Sign up at [Groq Console](https://console.groq.com/)).

### Local Development Installation

#### Step 1: Clone the Repository
```bash
git clone https://github.com/vijaychelumalla/AI-Interview-App.git
cd AI-Interview-App
```

#### Step 2: Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The backend server will start running on* `http://localhost:5000`.

#### Step 3: Setup the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../ai-interview-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The frontend client will spin up on* `http://localhost:3000`.

---

## 🌐 Deployment

The workspace contains configuration rules optimized for automated host platforms:

* **Frontend**: Can be easily hosted on **Netlify** using the pre-configured [netlify.toml](file:///d:/AI-APP/netlify.toml) file. The build command is `npm run build` and the output directory is `build`.
* **Backend**: Can be hosted on platforms like **Render**, **Heroku**, or **DigitalOcean**. Ensure all environment variables are correctly injected into the server settings.
