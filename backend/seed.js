import mongoose from "mongoose";
import fetch from "node-fetch";
import dotenv from "dotenv";
import Question from "./models/Question.js";
import Category from "./models/Category.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

async function seedData() {
  try {
    // Connect to DB
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Clear old data
    await Question.deleteMany({});
    await Category.deleteMany({});
    console.log("old data cleared");

    // Fetch JSON data
    const res = await fetch("https://test-data-gules.vercel.app/data.json");
    const jsonData = await res.json();
    const data = jsonData.data; 

    for (let cat of data) {
      let questionIds = [];

      for (let q of cat.ques) {
        // Skip questions with null title
        if (!q.title) continue;

        const question = new Question({
          title: q.title,
          url: q.yt_link || "",
          difficulty: "Easy",   //default value
          p1_link: q.p1_link || "",
          p2_link: q.p2_link || "",
          tags: q.tags ? q.tags.split(",") : []
        });

        await question.save();
        questionIds.push(question._id);
      }

      const category = new Category({
        title: cat.title,
        questions: questionIds
      });

      await category.save();
    }

    console.log("Data seeded successfully!");
    process.exit();

  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedData();
