import express from 'express';
import multer from 'multer';
import _ from 'lodash';
import path from 'path';
const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(path.join(__dirname, '..', '..', 'client', 'build', 'images')),
  filename: (req, file, cb) => {
    cb(null, `Custom-` + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 1000000 } });

router.post('/upload', upload.array('images', 5), (req, res) => {
  const images = req.files;
  res.send(_.map(images, (image: any) => image.filename));
});

export default router;
