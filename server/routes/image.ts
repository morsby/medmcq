import express from 'express';
import multer from 'multer';
import _ from 'lodash';
import path from 'path';
const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(path.join(__dirname, '..', '..', 'build', 'images')),
  filename: (req, file, cb) => {
    cb(null, `Custom-` + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 1000000 * 10 }, // 10 Megabytes
  fileFilter: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
});

router.post('/upload', upload.array('images', 5), (req, res) => {
  const images = req.files;
  res.send(_.map(images, (image: any) => image.filename));
});

export default router;
