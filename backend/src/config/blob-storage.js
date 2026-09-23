import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'mealmentor-images';

let blobServiceClient;
let containerClient;

try {
  if (connectionString) {
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(containerName);
    console.log('✅ Azure Blob Storage configured');
  } else {
    console.warn('⚠️  Azure Blob Storage connection string not set — file uploads will use local storage fallback');
  }
} catch (error) {
  console.error('❌ Azure Blob Storage initialization error:', error.message);
}

/**
 * Upload a file buffer to Azure Blob Storage.
 * @param {Buffer} buffer - File buffer to upload
 * @param {string} originalName - Original file name (for extension)
 * @param {string} folder - Folder prefix (e.g., 'meals', 'reports')
 * @returns {Promise<string>} - URL of the uploaded blob
 */
export async function uploadToBlob(buffer, originalName, folder = 'meals') {
  if (!containerClient) {
    throw new Error('Azure Blob Storage is not configured');
  }

  // Create container if it doesn't exist
  await containerClient.createIfNotExists({
    access: 'blob', // public read access for images
  });

  // Generate unique blob name
  const extension = originalName.split('.').pop() || 'jpg';
  const blobName = `${folder}/${uuidv4()}.${extension}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: getMimeType(extension),
    },
  });

  return blockBlobClient.url;
}

/**
 * Delete a blob from Azure Blob Storage.
 * @param {string} blobUrl - Full URL of the blob to delete
 */
export async function deleteBlob(blobUrl) {
  if (!containerClient) return;

  try {
    const blobName = new URL(blobUrl).pathname.split('/').slice(2).join('/');
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  } catch (error) {
    console.error('Error deleting blob:', error.message);
  }
}

function getMimeType(extension) {
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
  };
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

export default containerClient;
