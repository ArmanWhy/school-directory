// test-db.js
import { db } from "../../lib/db.js"; // Make sure path is correct

(async () => {
  try {
    // Simple test query
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("✅ DB Connected! Test query result:", rows[0].result);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
})();
