import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { filename } = req.query;
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!fs.existsSync(filePath)) return res.status(404).send("Image not found");

  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".png" ? "image/png" :
    ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
    "application/octet-stream";

  res.setHeader("Content-Type", contentType);
  fs.createReadStream(filePath).pipe(res);
}
