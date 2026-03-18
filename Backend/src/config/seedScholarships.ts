import mongoose from "mongoose";
import Scholarship from "../models/Scholarship"; 
import dotenv from "dotenv";
dotenv.config();



// 🎯 Constants
const ADMIN_ID = new mongoose.Types.ObjectId("695c34c44258e95051133ae9");

const providers = [
  "HDFC Bank",
  "Tata Trusts",
  "Google",
  "Reliance",
  "Infosys",
  "Wipro",
  "Amazon",
  "ONGC",
  "Aditya Birla",
  "Flipkart"
];

const categories = ["Merit", "Need", "Tech", "Research", "Abroad"];
const degrees = ["Undergraduate", "Postgraduate", "PhD"];

const descriptions = [
  "Supports financially weak but bright students",
  "Encourages innovation and research",
  "Merit-based scholarship for top performers",
  "Financial assistance for higher education",
  "Empowering future leaders"
];

// 🎲 Random Helpers
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const generateScholarships = (count: number) => {
  const data = [];

  for (let i = 1; i <= count; i++) {
    const includeUrl = i > 20; // ❌ first 20 without officialUrl

    const item: any = {
      name: `${getRandom(providers)} Scholarship ${i}`,
      provider: getRandom(providers),
      amount: Math.floor(Math.random() * 150000) + 50000, // 50k–200k
      deadline: new Date(
        2026,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ),
      category: getRandom(categories),
      gpaRequirement: +(Math.random() * 4 + 6).toFixed(1), // 6–10 GPA
      degreeLevel: getRandom(degrees),
      description: getRandom(descriptions),
      eligibility: [
        "Indian citizen",
        "Minimum academic score required",
        "Valid college admission"
      ],
      adminId: ADMIN_ID
    };

    // ✅ Add URL only after 20 items
    if (includeUrl) {
      item.officialUrl = `https://example${i}.com`;
    }

    data.push(item);
  }

  return data;
};

// 🚀 Seeder Function
const seedDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI;

    if (!mongoUrl) {
      throw new Error("❌ MONGO_URL not found in .env");
    }

    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB Connected");

    // 🧹 Optional: Clear old data
    await Scholarship.deleteMany({});
    console.log("🧹 Old scholarships removed");

    // ⚡ Generate 50 records
    const scholarships = generateScholarships(50);

    await Scholarship.insertMany(scholarships);
    console.log(`🎉 Inserted ${scholarships.length} scholarships`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};

seedDB()