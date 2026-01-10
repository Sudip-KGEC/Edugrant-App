🎓 EDUGRANT
AI-Powered Scholarship Discovery & Application Ecosystem

EDUGRANT is a comprehensive full-stack platform built for the GDGOC MCKVIE Tech Sprint Hackathon. It is designed to bridge the gap between students and financial aid by simplifying the discovery, eligibility checking, and application process through cutting-edge AI.

Developed with ❤️ by team Bug-Baba-Samity.

🚀 The Vision
Navigating the world of scholarships is often overwhelming. EDUGRANT leverages a modern tech stack to provide personalized recommendations, real-time notifications, and an intelligent AI assistant to ensure no student misses out on an opportunity due to lack of information.

🛠 Tech Stack
Frontend
React (TypeScript): For a type-safe, robust user interface.

Tailwind CSS: For rapid, responsive, and modern styling.

Framer Motion: For smooth, high-quality UI/UX animations.

Axios: For efficient, promise-based API communication.

Backend- (Typescript)
Node.js & Express.js: Scalable server-side logic.

MongoDB: NoSQL database for flexible data management.

Google Gemini Flash: Powering the intelligent scholarship chatbot.

Node-Cron: Handling scheduled tasks for real-time scholarship notifications.

JWT & OTP: Secure authentication and verification.

✨ Key Features
🤖 AI-Powered Scholarship Assistant
Integrated with Google Gemini Flash, our chatbot doesn't just answer questions—it analyzes student profiles to recommend the best-fit scholarships and explains complex eligibility criteria in simple terms.

🔔 Smart Notifications
Utilizing Node-Cron, the system tracks upcoming deadlines and automatically sends real-time alerts to users, ensuring they never miss a submission window.

🔐 Secure Authentication
A dual-layer security system featuring JWT-based sessions and OTP verification to keep sensitive student data and documents safe.

📊 Comprehensive Scholarship Management
A full CRUD system that allows for organized, searchable, and filterable scholarship listings, tailored to different educational backgrounds.

🎨 Immersive UI/UX
A sleek, professional dashboard built with Tailwind and enhanced with Framer Motion transitions to provide a premium user experience.

📂 Project Structure
Plaintext

EDUGRANT/
├── Backend/
│   ├── src/
│   │   ├── config/      # DB & Cloud configurations
│   │   ├── controllers/ # Business logic (Auth, Scholarship, Chat)
│   │   ├── middleware/  # Auth guards & Error handling
│   │   ├── models/      # MongoDB Schemas (User, Scholarship)
│   │   ├── routes/      # API Endpoints
│   │   ├── utils/       # Node-Cron & Gemini API helpers
│   │   └── server.ts    # Entry point
├── Frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Cards, Navbar, Loaders,Dashboard, Chat, Home, Auth)
│   │   ├── services/    # Axios API instances
|   |   |── App.tsx
│   │  
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the Repository
Bash

git clone https://github.com/Sudip-KGEC/EDUGRANT.git
cd EDUGRANT
2️⃣ Backend Configuration
Bash

cd Backend
npm install
Create a .env file in the Backend folder:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_key
Start Backend: npm run dev

3️⃣ Frontend Configuration
Bash

cd ../Frontend
npm install
Start Frontend: npm run dev

👥 Our Team: Bug-Baba-Samity
This project was built during the GDGOC MCKVIE Tech Sprint. We are a group of developers passionate about building tech that solves real-world accessibility issues.

Sudip Das (Backend Developer)
Sumit Kumar Nath (AI Developer)
Agniv Chowdhury (Frontend Developer)
Nababrato Biswas ( AI Developer)


🎯 Future Roadmap
🌍 Multilingual Support: AI assistance in regional languages.

📄 Auto-Document Verification: Using OCR to verify eligibility instantly.

🧠 Advanced Eligibility Scoring: Machine learning to predict "Match Probability" for scholarships.

Show Your Support! If you find this project helpful for the student community, please give us a ⭐ on GitHub!
