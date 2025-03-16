import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  timeout: 120000, // 120 seconds
});

export const sendImageToCloudinary = (
  fileName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      path,
      {
        public_id: fileName.trim(),
        resource_type: 'image', // Use the correct resource type
        chunk_size: 30000000, // 30 MB
        upload_preset: 'showkat', // Add your preset name here
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', JSON.stringify(error, null, 2));
          return reject(error);
        }
        resolve(result as UploadApiResponse);
      }
    );
    
    
    
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
