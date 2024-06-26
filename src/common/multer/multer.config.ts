import * as multer from 'multer';

const storage = multer.diskStorage({
    destination: process.env.LOCAL_STORAGE_FOLDER || 'uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      cb(null, `${uniqueSuffix}.${ext}`);
    },
  });
  
  export const upload = multer({ storage });