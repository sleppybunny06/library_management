import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Book from "./models/Book.js";
import Student from "./models/Student.js";
import IssueRecord from "./models/IssueRecord.js";

export async function connectDB() {
  try {
    let mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.warn("⚠️ MONGODB_URI is not defined. Starting mongodb-memory-server instead.");
      const mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      console.log(`✅ Started in-memory MongoDB at ${mongoURI}`);
    }
    
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected successfully");
    await seedDB();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

async function seedDB() {
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      console.log("Seeding books...");
      const categories = ["Programming", "AI", "Machine Learning", "Database", "Networking", "Operating Systems", "Mathematics"];
      const booksToInsert = Array.from({ length: 50 }).map((_, i) => {
        const title = `Sample Book ${i + 1}`;
        const category = categories[Math.floor(Math.random() * categories.length)];
        const qty = Math.floor(Math.random() * 10) + 1;
        return {
          title,
          author: `Author ${i % 5 + 1}`,
          isbn: `ISBN-${1000 + i}`,
          category,
          publisher: "VTU Press",
          publishedYear: 2020 + (i % 4),
          quantity: qty,
          availableQuantity: qty,
          rackNumber: `R-${Math.floor(i / 10) + 1}`,
          description: "This is a sample description for the book.",
        };
      });
      await Book.insertMany(booksToInsert as any[]);
    }

    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log("Seeding students...");
      const branches = ["CSE", "ISE", "AIML", "ECE"];
      const studentsToInsert = Array.from({ length: 30 }).map((_, i) => ({
        usn: `1RV20CS${(i + 1).toString().padStart(3, '0')}`,
        name: `Student ${i + 1}`,
        email: `student${i + 1}@college.edu`,
        phone: `9876543${i.toString().padStart(3, '0')}`,
        branch: branches[Math.floor(Math.random() * branches.length)],
        semester: Math.floor(Math.random() * 8) + 1,
        section: String.fromCharCode(65 + (i % 3)), // A, B or C
      }));
      await Student.insertMany(studentsToInsert as any[]);
    }
    console.log("✅ Database seeding check complete.");
  } catch (err) {
    console.error("❌ Seed Error: ", err);
  }
}

