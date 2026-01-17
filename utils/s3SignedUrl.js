// utils/s3SignedUrl.js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3Client.js";

export const getProductImageUrl = async (fileKey) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return signedUrl;
};
