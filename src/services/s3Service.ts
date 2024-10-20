import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  /* credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }, */
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToS3 = async (file: Express.Multer.File) => {
  const fileName = `${uuidv4()}-${file.originalname}`;
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME || 'resumefeedback-media',
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const upload = new Upload({
    client: s3,
    params: uploadParams,
  });

  const result = await upload.done();
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result.Key}`;
};

export { upload, uploadToS3 };
