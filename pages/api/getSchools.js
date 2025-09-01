import { db } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, name, address, city, image FROM schools"
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
