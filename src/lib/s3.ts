import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "wrs-images";
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || "";

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Get a presigned URL for uploading a file directly from the browser
 */
export async function getUploadPresignedUrl(
  filename: string,
  contentType: string,
  folder: string = "uploads"
): Promise<{ uploadUrl: string; key: string }> {
  const extension = filename.split(".").pop();
  const key = `${folder}/${uuidv4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { uploadUrl, key };
}

/**
 * Upload a file directly (server-side)
 */
export async function uploadFile(
  file: Buffer,
  filename: string,
  contentType: string,
  folder: string = "uploads"
): Promise<UploadResult> {
  const extension = filename.split(".").pop();
  const key = `${folder}/${uuidv4()}.${extension}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return {
    key,
    url: getPublicUrl(key),
  };
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(key: string): string {
  if (CLOUDFRONT_URL) {
    return `${CLOUDFRONT_URL}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

/**
 * Get a presigned URL for downloading/viewing a private file
 */
export async function getDownloadPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Validate file type
 */
export function isValidImageType(contentType: string): boolean {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  return validTypes.includes(contentType);
}

/**
 * Validate file size (default 5MB max)
 */
export function isValidFileSize(
  sizeInBytes: number,
  maxSizeInMB: number = 5
): boolean {
  return sizeInBytes <= maxSizeInMB * 1024 * 1024;
}
