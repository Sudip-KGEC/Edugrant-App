🎓 EDUGRANT

AI-Powered Scholarship Discovery & Assistance Platform

EDUGRANT is a full-stack web application designed to help students discover, understand, and apply for scholarships effortlessly. The platform leverages AI-driven assistance, secure authentication, and a scalable backend architecture to simplify the scholarship application process.

🚀 Features

🔐 User Authentication & Authorization

Secure login/signup using JWT

OTP-based verification

🤖 AI Scholarship Assistant

Helps students find relevant scholarships

Answers queries related to eligibility, deadlines, and application steps

🎓 Scholarship Management

Create, read, update, and delete scholarship data

Organized and searchable listings

🧑‍🎓 User Profile Management

Track saved scholarships

Personalized experience

🌐 Scalable Full-Stack Architecture

Separate backend & frontend for clean maintainability

🛠 Tech Stack
Backend

Node.js

Express.js

TypeScript

MongoDB

JWT Authentication

MVC Architecture

Frontend

React (planned / in progress)

Modern UI structure

📂 Project Structure
EDUGRANT/
│
├── Backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & security middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper utilities
│   │   └── server.ts        # App entry point
│   ├── tsconfig.json
│   └── package.json
│
├── Frontend/
│   └── (React app – upcoming)
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Sudip-KGEC/EDUGRANT.git
cd EDUGRANT

2️⃣ Backend Setup
cd Backend
npm install

3️⃣ Environment Variables

Create a .env file inside Backend/ and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run the Backend Server
npm run dev


Server will start at:

http://localhost:5000

🔐 API Modules

/api/users – User authentication & profile

/api/scholarships – Scholarship management

/api/chat – AI-powered scholarship assistance

🎯 Future Enhancements

🌍 Full React frontend integration

📊 Scholarship recommendation engine

📅 Deadline reminders & notifications

📱 Mobile-friendly UI

🧠 Advanced AI eligibility scoring


⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
Contributions, issues, and feature requests are welcome 🙌
