# 🎓 CommunityLearn
> An Intelligent Community Tutoring Platform with AI Features.

![CommunityLearn](CommunityLearn/frontendd/src/assets/hero.png)

Welcome to **CommunityLearn**, a comprehensive, gamified learning and mentoring platform. CommunityLearn connects eager students with verified expert mentors, providing an end-to-end learning ecosystem complete with live tutoring sessions, AI-powered study assistance, auto-graded quizzes, and community-driven knowledge sharing.

---

## ✨ Key Features

### 🧑‍🎓 For Students
- **Interactive Dashboards**: Track your learning progress, current streak, and earned points.
- **Find Mentors**: Browse through a marketplace of expert mentors across different subjects.
- **Book Live Sessions**: Seamlessly schedule and join live tutoring sessions.
- **AI Study Assistant**: Get immediate answers, resource recommendations, and personalized learning paths.
- **Gamified Learning**: Earn badges, level up, and complete quizzes to prove your knowledge.

### 👩‍🏫 For Mentors
- **Session Management**: Host and manage live tutoring sessions for students.
- **Student Analytics**: Track student progress and performance.
- **Resource Sharing**: Upload study materials, videos, and PDFs for your students.
- **AI Auto-grading**: Automatically grade student quizzes with semantic similarity analysis.

---

## 🛠️ Tech Stack

The project is built using a modern, scalable microservice architecture:

**Frontend**
- **Framework**: React.js
- **Styling**: Tailwind CSS & Custom CSS (Glassmorphism & 3D UI)
- **Icons**: Lucide React
- **Animations**: CSS Keyframes & Framer Motion

**Backend**
- **Server**: Node.js & Express.js
- **Database**: PostgreSQL (via `pg` pool)
- **Authentication**: JWT & bcrypt
- **Mailing**: Nodemailer for OTP & verification

**AI Microservice**
- **Framework**: Python Flask
- **Models**: Hugging Face `sentence-transformers` (all-MiniLM-L6-v2)
- **Libraries**: PyTorch, NumPy
- **Capabilities**: Semantic search, auto-grading, resource recommendation, tutor matching, keyword extraction.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (running locally on port 5432)

### 1. Database Setup
1. Open pgAdmin or `psql` terminal.
2. Create a database named `communitylearn`.
3. Run the `CommunityLearn/schema.sql` file to create all tables, triggers, and sample data:
   ```bash
   psql -U postgres -d communitylearn -f CommunityLearn/schema.sql
   ```

### 2. Backend Setup (Node.js)
1. Navigate to the backend directory:
   ```bash
   cd CommunityLearn/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with your DB credentials, JWT secret, and Email details (already provided in the repo template).
4. Start the backend server:
   ```bash
   npm start
   ```
   *(Runs on http://localhost:5000)*

### 3. AI Service Setup (Python)
1. Navigate to the AI service directory:
   ```bash
   cd CommunityLearn/ai-service
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the AI service:
   ```bash
   python ai_service.py
   ```
   *(Runs on http://localhost:5001)*

### 4. Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd CommunityLearn/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *(Runs on http://localhost:3000)*

---

## 📂 Project Structure

```text
📦 CommunityLearn
 ┣ 📂 ai-service          # Python Flask AI Engine
 ┃ ┣ 📜 ai_service.py
 ┃ ┗ 📜 requirements.txt
 ┣ 📂 backend             # Node.js Express Server
 ┃ ┣ 📜 server.js
 ┃ ┣ 📜 .env
 ┃ ┗ 📜 package.json
 ┣ 📂 frontend            # React Application
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📜 App.js          # Main Application (Routing, Pages, Components)
 ┃ ┃ ┣ 📜 App.css
 ┃ ┃ ┗ 📜 index.js
 ┃ ┣ 📂 public
 ┃ ┗ 📜 package.json
 ┗ 📜 schema.sql          # PostgreSQL Database Schema
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is built for educational and community purposes. All rights reserved.
