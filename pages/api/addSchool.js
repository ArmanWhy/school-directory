// pages/api/addSchool.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { db } from "../../lib/db";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const uploadDir = path.join(process.cwd(), "public/schoolImages");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ error: "Form parsing failed", details: err.message });
      }

      console.log("Form fields received:", fields);
      console.log("Files received:", files);

      const { name, address, city, state, contact, email_id } = fields;

      let image = "";

      if (files.image) {
        const uploadedFile = Array.isArray(files.image) ? files.image[0] : files.image;
        const fileExt = path.extname(uploadedFile.originalFilename || "");
        const fileName = `${Date.now()}${fileExt}`;
        const newPath = path.join(uploadDir, fileName);

        try {
          fs.renameSync(uploadedFile.filepath, newPath);
          image = `/schoolImages/${fileName}`;
        } catch (fileError) {
          console.error("File rename error:", fileError);
          return res.status(500).json({ error: "File upload failed", details: fileError.message });
        }
      }

      console.log("Inserting school into DB:", { name, address, city, state, contact, email_id, image });

      try {
        await db.query(
          "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?,?,?,?,?,?,?)",
          [name, address, city, state, contact, email_id, image]
        );
        res.status(200).json({ message: "School added successfully" });
      } catch (dbError) {
        console.error("DB insert error:", dbError, "Query values:", [name, address, city, state, contact, email_id, image]);
        res.status(500).json({ error: dbError.message });
      }
    });
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: error.message });
  }
}
