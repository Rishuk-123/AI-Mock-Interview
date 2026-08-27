# 🤖 AI Mock Interview & Resume Analyzer

An **end-to-end MERN-stack web application** designed to help job candidates prepare for technical interviews, analyze resumes for ATS compatibility, and track their interview performance through a personalized dashboard.

---

## ⭐ Key Highlights

### 🎤 1. AI Mock Interview Room

* Conduct interactive technical mock interviews directly in the browser.
* Supports **real-time speech recognition** using the Web Speech API.
* Provides **text-input fallback** when speech recognition is unavailable.
* Role-specific question banks for:

  * Frontend Development
  * Backend Development
  * Full-Stack Development
* Smooth question navigation with instant answer evaluation.
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
* Current interview credit balance

Protected routes ensure that authenticated users can access candidate-specific features.

### 🔐 5. Secure Authentication

The application uses:

* **JWT** for authentication
* **Bcrypt** for password hashing
* Protected React routes
* Express authentication middleware
* MongoDB-based user management

### 💳 6. Credit-Based Interview System

* Users start with **100 free interview credits** upon registration.
* Generating and submitting an interview session costs **50 credits**.
* Automatic credit balance validation blocks interview creation if credits are insufficient.
* Credit balance is deducted when an interview session is generated/submitted.
* Live credit balance indicators are displayed in the navbar and interview setup screens.
* Credit balance is stored with the authenticated user's data.

---

## 🎯 Core Modules

| Module                 | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| **Authentication**     | Secure user registration, login, and initial 100-credit allocation |
| **Credit System**      | Enforces 50-credit cost per interview session and manages balance  |
| **Mock Interview**     | Role-based technical interview practice with balance validation    |
| **Speech Interaction** | Voice-based question reading and answer transcription              |
| **Resume Analyzer**    | Automated ATS compatibility evaluation and keyword extraction      |
| **Profile**            | Candidate information, active credit balance, and skill management |
| **Results**            | Instant AI-driven scoring and detailed answer feedback             |
| **History**            | Previous interview records and performance analytics               |
| **Analytics**          | Track preparation progress                                         |

---

## 🔄 Application Workflow

```text
                ┌──────────────────────┐
                │        User          │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  JWT Authentication  │
                └──────────┬───────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌─────────────────┐       ┌──────────────────┐
     │  Credit Check   │       │ Resume Analyzer  │
     │  (≥ 50 Credits) │       └─────────┬────────┘
     └────────┬────────┘                 │
              │                          ▼
              ▼                 PDF Text Extraction
     ┌─────────────────┐                 │
     │ Mock Interview  │                 ▼
     │ (-50 Credits)   │         ATS Score Analysis
     └────────┬────────┘                 │
              │                          │
              ▼                          │
     Questions + Speech                  │
              │                          │
              ▼                          │
      Answer Evaluation                  │
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

### 💳 Credit Flow

```text
New User
   │
   ▼
100 Free Credits
   │
   ▼
Start Interview
   │
   ▼
Check Balance
   │
   ├─────────────── < 50 ───────────────► ❌ Interview Blocked
   │
   ▼
Balance ≥ 50
   │
   ▼
Interview Generated
   │
   ▼
50 Credits Deducted
   │
   ▼
Interview Session
   │
   ▼
Results + History
```

---

## 🔒 Security

The application implements several security mechanisms:

* JWT-based authentication
* Password hashing using Bcrypt
* Protected frontend routes
* Authentication middleware on backend APIs
* Environment variables for sensitive configuration
* MongoDB-based persistent user data
* Server-side authentication and authorization
* Credit balance validation before interview creation
* Credit deduction controlled through authenticated backend operations

> **Important:** Never commit your `.env` file or expose your MongoDB URI and JWT secret publicly.

---

## 📌 Project Highlights

This project demonstrates practical experience with:

* Full-stack **MERN development**
* REST API development
* JWT authentication and authorization
* Password hashing with Bcrypt
* MongoDB database integration
* Mongoose data modeling
* React component architecture
* Client-side routing
* Global state management with Zustand
* Browser Web Speech API
* Client-side PDF processing
* Resume parsing and ATS scoring
* Persistent local state
* **Credit-based resource management**
* **Balance validation and transaction handling**
* Responsive UI development with Tailwind CSS

---

## 💡 Why This Project?

The application combines **interview preparation, resume optimization, credit management, and performance tracking** into a single platform.

Instead of using separate tools for resume analysis and interview practice, candidates can:

**Upload Resume → Check ATS Score → Practice Interview → Spend Credits → Get Results → Track Progress**

The credit-based system introduces a practical resource-management mechanism where users receive **100 initial credits**, while each interview session consumes **50 credits**.

This makes the project useful as a practical full-stack MERN application demonstrating frontend development, backend APIs, authentication, database integration, browser APIs, PDF processing, state management, and resource management.

---

## 👨‍💻 Author

**Rishu Kesharwani**

GitHub: `Rishuk-123`

Repository: `AI_MOCK_INTERVIEW`
