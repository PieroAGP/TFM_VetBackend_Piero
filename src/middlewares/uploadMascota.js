const multer = require('multer');
const path = require('path');
const fs = require('fs');

const destinationPath = path.join(__dirname, '..', 'uploads', 'mascotas');

// Asegurarse de que el directorio exista
fs.mkdirSync(destinationPath, { recursive: true });

const storage = multer.diskStorage({
  destination: destinationPath,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
