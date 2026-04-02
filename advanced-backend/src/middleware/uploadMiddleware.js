import multer from 'multer';
import path from 'path';
import fs from 'fs';
import slugify from 'slugify';

// Check for uploads folder existence
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const title = req.body.title || 'upload';
        const slug = slugify(title, { lower: true, strict: true });
        cb(null, `${slug}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Multer instance
const upload = multer({ storage });

export default upload;
