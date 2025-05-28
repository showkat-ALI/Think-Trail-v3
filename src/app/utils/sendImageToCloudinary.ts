import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  timeout: 120000,
});

// Cloudinary upload handler
export const sendFileToCloudinary = (
  fileName: string,
  localFilePath: string
): Promise<{ url: string; [key: string]: any }> => {
  return new Promise((resolve, reject) => {
    const isPDF = fileName.toLowerCase().endsWith('.pdf');

    cloudinary.uploader.upload_large(
      localFilePath,
      {
        public_id: fileName.trim(),
        resource_type: isPDF ? 'raw' : 'auto',
        chunk_size: 30000000,
        upload_preset: 'showkat',
      },
      (error, result) => {
        // Clean up temp file
        fs.unlink(localFilePath, () => {});

        if (error) {
          console.error('Cloudinary Upload Error:', JSON.stringify(error, null, 2));
          return reject(error);
        }

        const resultTyped = result as UploadApiResponse;

        // Fix URL if misclassified
        let finalUrl = resultTyped.secure_url;
        if (isPDF && finalUrl.includes('/image/upload/')) {
          finalUrl = finalUrl.replace('/image/upload/', '/raw/upload/');
        }

        resolve({ ...resultTyped, url: finalUrl });
      }
    );
  });
};

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), '/uploads/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Keep file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Multer middleware for handling file uploads
export const upload = multer({ storage: storage });
