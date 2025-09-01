import { db } from "./lib/db.js";

try {
  const [rows] = await db.query("SELECT 1 + 1 AS result");
  console.log("✅ DB Connected:", rows);
} catch (error) {
  console.error("❌ DB Connection Failed:", error.message);
}
