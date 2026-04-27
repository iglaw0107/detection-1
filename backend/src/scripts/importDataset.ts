import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import Crime from "../models/crime.model";

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("DB Connected"))
  .catch(console.error);

// 📍 coords
const coordsMap: any = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
};

// 🧠 smart risk generator
const getRiskLevel = (crime: string, weapon: string) => {
  const highRisk = ["robbery", "assault", "violence"];
  const mediumRisk = ["theft", "vandalism"];

  if (highRisk.includes(crime)) return "high";
  if (weapon && weapon !== "None") return "medium";
  if (mediumRisk.includes(crime)) return "medium";

  return "low";
};

const normalizeCrime = (crime: string) => {
  const c = crime?.toLowerCase();

  if (c?.includes("theft")) return "theft";
  if (c?.includes("robbery")) return "robbery";
  if (c?.includes("assault")) return "assault";
  if (c?.includes("violence")) return "violence";
  if (c?.includes("trespass")) return "trespassing";
  if (c?.includes("vandal")) return "vandalism";

  return "unknown";
};

const results: any[] = [];

fs.createReadStream("data/db-database.csv")
  .pipe(csv())
  .on("data", (row) => {
    try {
      const location = row.location || "Unknown";

      const crimeRaw = row.Crime_type || "";
      const weapon = row["Weapon Used"] || "None";

      const predictedCrime = normalizeCrime(crimeRaw);
      const riskLevel = getRiskLevel(predictedCrime, weapon);

      results.push({
        crimeId: `dataset_${Date.now()}_${Math.random()}`,

        location,
        predictedCrime,
        riskLevel,

        date: row.date || row["Date Reported"],
        time: row.time || "12:00",

        lat: coordsMap[location]?.lat || 28.6139,
        lng: coordsMap[location]?.lng || 77.2090,

        aiSummary: `Crime: ${predictedCrime}, Weapon: ${weapon}`,
        tags: ["dataset"],
        isSaved: false,
      });
    } catch (err) {
      console.error("Row error:", err);
    }
  })
  .on("end", async () => {
    try {
      await Crime.deleteMany({ tags: "dataset" }); // cleanup old bad data
      await Crime.insertMany(results);

      console.log("✅ CLEAN DATASET IMPORTED");
      process.exit();
    } catch (err) {
      console.error(err);
    }
  });