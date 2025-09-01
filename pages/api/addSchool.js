// pages/api/addSchool.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { db } from "../../lib/db";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const uploadDir = path.join(process.cwd(), "public/schoolImages");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({ uploadDir, keepExtensions: true, multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: err.message });

      const { name, address, city, state, contact, email_id } = fields;

      let image = "";

      if (files.image) {
        const uploadedFile = Array.isArray(files.image) ? files.image[0] : files.image;
        const fileExt = path.extname(uploadedFile.originalFilename || "");
        const fileName = `${Date.now()}${fileExt}`;
        const newPath = path.join(uploadDir, fileName);

        fs.renameSync(uploadedFile.filepath, newPath);

        // Save the URL path that works in UI
        image = `/schoolImages/${fileName}`;
      }

      try {
        await db.query(
          "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?,?,?,?,?,?,?)",
          [name, address, city, state, contact, email_id, image]
        );
        res.status(200).json({ message: "School added successfully" });
      } catch (dbError) {
        console.error("DB insert error:", dbError);
        res.status(500).json({ error: dbError.message });
      }
    });
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: error.message });
  }
}
