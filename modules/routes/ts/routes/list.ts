import * as fs from "fs";
import { join } from "path";
const UPLOADS = join(__dirname, `/uploads`);

export const list = (req, res) => {
  const { project, container } = req.params;
  const folderPath = join(UPLOADS, project, "files", container);
  if (!fs.existsSync(folderPath)) {
    res.json({ status: true, documents: [] });
    return;
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      // Handle error if the folder doesn't exist or there was an error reading it
      console.error(err);
      res.status(500).json({ status: false, error: "Error reading folder." });
    } else {
      res.json({ status: true, documents: files });
    }
  });
};
