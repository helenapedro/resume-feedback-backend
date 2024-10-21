import { S3Client, ObjectCannedACL } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const BUCKET_NAME = "resumefeedback-media";
const REGION_NAME = "us-east-2";

const s3 = new S3Client({
  region: REGION_NAME,

  /* credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }, */
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const day = date.getDate().toString().padStart(2, '0'); 
  return `${year}-${month}-${day}`;
};

const uploadToS3 = async (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname);
  const formattedDate = formatDate(new Date());
  const uniqueId = uuidv4();
  const fileName = `resume_${formattedDate}_${uniqueId}${ext}`; 
  
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read' as ObjectCannedACL,
  };

  const upload = new Upload({
    client: s3,
    params: uploadParams,
  });

  const result = await upload.done();
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${result.Key}`;
};

export { upload, uploadToS3 };