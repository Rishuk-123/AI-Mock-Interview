# 🤖 AI Mock Interview & Resume Analyzer

An **end-to-end MERN-stack web application** designed to help job candidates prepare for technical interviews, analyze resumes for ATS compatibility, and track their interview performance through a personalized dashboard.

---

## ⭐ Key Highlights

### 🎤 1. AI Mock Interview Room

* Conduct **interactive technical mock interviews** directly in the browser.
* Supports **real-time speech recognition** using the Web Speech API.
* Provides **text-input fallback** when speech recognition is unavailable.
* Role-specific question banks for:

  * Frontend Development
  * Backend Development
  * Full-Stack Development
* Smooth question navigation with **instant answer evaluation**.
* Automatically records interview performance and scores.

### 📄 2. Multi-Factor ATS Resume Analyzer

Analyze resumes directly in the browser using `pdfjs-dist`.

The ATS score is calculated using three major factors:

| Factor                    | Weight | What It Checks                                  |
| ------------------------- | -----: | ----------------------------------------------- |
| **Section Formatting**    |    30% | Education, Experience, Skills, Projects         |
| **Technical Keywords**    |    50% | Languages, frameworks, databases & technologies |
| **Action Verbs & Impact** |    20% | Verbs such as Developed, Implemented, Optimized |

**Additional features:**

* Client-side PDF text extraction
* Automated ATS compatibility scoring
* Technical keyword analysis
* Action-verb detection
* Native PDF preview using Blob URLs

### 📊 3. Session History & Analytics

* Stores previous mock interview sessions.
* Uses **Zustand + localStorage** for persistent client-side state.
* Provides historical interview scores.
* Allows users to review previous questions and answers.
* Helps candidates track their interview preparation progress.

### 👤 4. User Profile Management

Users can maintain a personalized candidate profile containing:

* Personal information
* College / university
* Target job role
* Technical skills
* Interview preparation preferences

Protected routes ensure that authenticated users can access candidate-specific features.

### 🔐 5. Secure Authentication

The application uses:

* **JWT** for authentication
* **Bcrypt** for password hashing
* Protected React routes
* Express authentication middleware
* MongoDB-based user management

---

# 🛠️ Tech Stack

## Frontend

* **React 18**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* **Zustand**
* **React Router DOM v6**
* **pdfjs-dist**
* Web Speech API

## Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JSON Web Tokens (JWT)**
* **Bcrypt**

---

# 📁 Project Structure

```text
AI_MOCK/
│
├── README.md
│
├── client/                         # React + Vite Frontend
│   ├── public/
│   └── src/
│       ├── components/             # Navbar, Protected Routes, Modals
│       ├── layouts/                # Main Layout
│       ├── pages/                  # Application Pages
│       │   ├── History/
│       │   ├── InterviewRoom/
│       │   ├── Profile/
│       │   ├── Results/
│       │   └── Resume/
│       ├── store/                  # Zustand State Management
│       │   ├── authStore.js
│       │   └── useInterviewStore.js
│       ├── App.jsx                 # Routing Configuration
│       └── main.jsx                # Application Entry Point
│
├── server/                         # Express Backend
│   ├── config/                     # Database & Environment Config
│   ├── controllers/                # Business Logic
│   ├── middleware/                 # JWT & Error Handling
│   ├── models/                     # Mongoose Schemas
│   ├── routes/                     # API Routes
│   ├── services/                   # Helper Services
│   ├── uploads/                    # Temporary File Uploads
│   ├── utils/                      # Utility Functions
│   ├── .env
│   ├── .env.example
│   ├── app.js                      # Express Configuration
│   └── server.js                   # Server Entry Point
│
└──
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* **Node.js v18 or higher**
* **MongoDB** — Local MongoDB or MongoDB Atlas
* **Git**
* Modern web browser with Web Speech API support

---

## 1. Clone the Repository

```bash
git clone https://github.com/Rishuk-123/AI_MOCK.git
cd AI_MOCK
```

---

## 2. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

Or:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open a **new terminal** and navigate to the client directory:

```bash
cd client
npm install
```

Start the Vite development server:

```bash
npm run dev
```

---

## 4. Open the Application

Open your browser and visit:

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

```text
                ┌──────────────────────┐
                │       User           │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   JWT Authentication │
                └──────────┬───────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌─────────────────┐       ┌──────────────────┐
     │ Mock Interview  │       │ Resume Analyzer  │
     └────────┬────────┘       └─────────┬────────┘
              │                          │
              ▼                          ▼
     Questions + Speech          PDF Text Extraction
              │                          │
              ▼                          ▼
       Answer Evaluation          ATS Score Analysis
              │                          │
              └────────────┬─────────────┘
                           ▼
                ┌──────────────────────┐
                │ Results & Analytics  │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Session History    │
                └──────────────────────┘
```

---

# 🎯 Core Modules

| Module                 | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| **Authentication**     | Secure user registration and login         |
| **Mock Interview**     | Role-based technical interview practice    |
| **Speech Interaction** | Voice-based question/answer interaction    |
| **Resume Analyzer**    | Automated ATS compatibility evaluation     |
| **Profile**            | Candidate information and skill management |
| **Results**            | Interview performance and scoring          |
| **History**            | Previous interview sessions and reviews    |
| **Analytics**          | Track preparation progress                 |

---

# 🔒 Security

The application implements several security mechanisms:

* JWT-based authentication
* Password hashing using Bcrypt
* Protected frontend routes
* Authentication middleware on backend APIs
* Environment variables for sensitive configuration
* MongoDB-based persistent user data

> **Important:** Never commit your `.env` file or expose your MongoDB URI and JWT secret publicly.

---

# 💡 Why This Project?

The application combines **interview preparation, resume optimization, and performance tracking** into a single platform.

Instead of using separate tools for resume analysis and interview practice, candidates can:

**Upload Resume → Check ATS Score → Practice Interview → Get Results → Track Progress**

This makes the project useful as a practical **full-stack MERN application** demonstrating frontend development, backend APIs, authentication, database integration, browser APIs, PDF processing, and state management.

---

# 👨‍💻 Author

**Rishu Kesharwani**

GitHub: `Rishuk-123`

Repository: `AI_MOCK`
