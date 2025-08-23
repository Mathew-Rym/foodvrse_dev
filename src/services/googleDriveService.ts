import { google } from 'googleapis';

// Google Drive API configuration
const GOOGLE_DRIVE_CONFIG = {
  API_KEY: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
  CLIENT_ID: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
  CLIENT_SECRET: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET,
  FOLDER_ID: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID,
  SERVICE_ACCOUNT_EMAIL: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL || 'drive-api@spry-sentry-468018-q6.iam.gserviceaccount.com',
};

// Initialize Google Drive API
const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    keyFile: './service-account-key.json', // Path to your service account key file
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
    ],
  }),
});

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
  downloadLink?: string;
}

export interface UploadOptions {
  fileName: string;
  fileContent: Buffer | string;
  mimeType?: string;
  parentFolderId?: string;
}

export class GoogleDriveService {
  /**
   * Upload a file to Google Drive
   */
  static async uploadFile(options: UploadOptions): Promise<DriveFile> {
    try {
      const { fileName, fileContent, mimeType = 'application/octet-stream', parentFolderId = GOOGLE_DRIVE_CONFIG.FOLDER_ID } = options;

      const fileMetadata = {
        name: fileName,
        parents: parentFolderId ? [parentFolderId] : [],
      };

      const media = {
        mimeType,
        body: fileContent,
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink',
      });

      if (!response.data.id) {
        throw new Error('Failed to upload file: No file ID returned');
      }

      return {
        id: response.data.id,
        name: response.data.name || fileName,
        mimeType: response.data.mimeType || mimeType,
        size: response.data.size,
        createdTime: response.data.createdTime || new Date().toISOString(),
        modifiedTime: response.data.modifiedTime || new Date().toISOString(),
        webViewLink: response.data.webViewLink,
      };
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download a file from Google Drive
   */
  static async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await drive.files.get({
        fileId: fileId,
        alt: 'media',
      }, {
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data as ArrayBuffer);
    } catch (error) {
      console.error('Error downloading file from Google Drive:', error);
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List files in a folder
   */
  static async listFiles(folderId?: string, pageSize: number = 10): Promise<DriveFile[]> {
    try {
      const query = folderId 
        ? `'${folderId}' in parents and trashed=false`
        : 'trashed=false';

      const response = await drive.files.list({
        q: query,
        pageSize,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)',
        orderBy: 'modifiedTime desc',
      });

      return (response.data.files || []).map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        size: file.size,
        createdTime: file.createdTime!,
        modifiedTime: file.modifiedTime!,
        webViewLink: file.webViewLink,
      }));
    } catch (error) {
      console.error('Error listing files from Google Drive:', error);
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a file from Google Drive
   */
  static async deleteFile(fileId: string): Promise<void> {
    try {
      await drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new folder
   */
  static async createFolder(folderName: string, parentFolderId?: string): Promise<DriveFile> {
    try {
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : [],
      };

      const response = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id, name, mimeType, createdTime, modifiedTime',
      });

      if (!response.data.id) {
        throw new Error('Failed to create folder: No folder ID returned');
      }

      return {
        id: response.data.id,
        name: response.data.name || folderName,
        mimeType: 'application/vnd.google-apps.folder',
        createdTime: response.data.createdTime || new Date().toISOString(),
        modifiedTime: response.data.modifiedTime || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating folder in Google Drive:', error);
      throw new Error(`Failed to create folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for files by name or content
   */
  static async searchFiles(query: string, folderId?: string): Promise<DriveFile[]> {
    try {
      let searchQuery = `(name contains '${query}' or fullText contains '${query}') and trashed=false`;
      
      if (folderId) {
        searchQuery += ` and '${folderId}' in parents`;
      }

      const response = await drive.files.list({
        q: searchQuery,
        pageSize: 20,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)',
        orderBy: 'modifiedTime desc',
      });

      return (response.data.files || []).map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        size: file.size,
        createdTime: file.createdTime!,
        modifiedTime: file.modifiedTime!,
        webViewLink: file.webViewLink,
      }));
    } catch (error) {
      console.error('Error searching files in Google Drive:', error);
      throw new Error(`Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get file metadata
   */
  static async getFileMetadata(fileId: string): Promise<DriveFile> {
    try {
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink',
      });

      const file = response.data;
      return {
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        size: file.size,
        createdTime: file.createdTime!,
        modifiedTime: file.modifiedTime!,
        webViewLink: file.webViewLink,
      };
    } catch (error) {
      console.error('Error getting file metadata from Google Drive:', error);
      throw new Error(`Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update file permissions to make it publicly accessible
   */
  static async makeFilePublic(fileId: string): Promise<void> {
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (error) {
      console.error('Error making file public:', error);
      throw new Error(`Failed to make file public: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(fileId: string): string {
    return `https://drive.google.com/uc?id=${fileId}`;
  }

  /**
   * Get direct download URL for a file
   */
  static getDownloadUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
}

export default GoogleDriveService; 