Google Drive API Configuration Steps:

# 🚀 Google Drive API Configuration for FoodVrse

## 📋 Prerequisites (Already Completed ✅)
- Google Cloud Project: spry-sentry-468018-q6
- Service Account: foodvrse_Drive API
- Service Account Email: drive-api@spry-sentry-468018-q6.iam.gserviceaccount.com
- Service Account ID: 103201487407521936323

## 🔧 Step 1: Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **spry-sentry-468018-q6**
3. Navigate to **APIs & Services** > **Library**
4. Search for **"Google Drive API"**
5. Click on **Google Drive API**
6. Click **Enable**

## 🔑 Step 2: Create Service Account Key

1. Go to **IAM & Admin** > **Service Accounts**
2. Click on **foodvrse_Drive API**
3. Go to **Keys** tab
4. Click **Add Key** > **Create new key**
5. Choose **JSON** format
6. Download the JSON key file
7. **IMPORTANT**: Keep this file secure and never commit it to version control

## 📁 Step 3: Set Up Google Drive Folder Structure

1. Create a shared folder in Google Drive for FoodVrse
2. Share the folder with: drive-api@spry-sentry-468018-q6.iam.gserviceaccount.com
3. Give **Editor** permissions to the service account

## 🔐 Step 4: Environment Variables

Add these to your `.env.local` file:

```bash
# Google Drive API Configuration
VITE_GOOGLE_DRIVE_API_KEY=YOUR_API_KEY_HERE
VITE_GOOGLE_DRIVE_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_GOOGLE_DRIVE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
VITE_GOOGLE_DRIVE_FOLDER_ID=YOUR_FOLDER_ID_HERE
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=drive-api@spry-sentry-468018-q6.iam.gserviceaccount.com
```

## 📦 Step 5: Install Required Packages

```bash
npm install googleapis @google-cloud/local-auth
```

## 🎯 Step 6: Create Google Drive Service

Create a new file: `src/services/googleDriveService.ts`


## 🚀 Step 7: Usage Examples

### Upload a File
```typescript
import GoogleDriveService from '@/services/googleDriveService';

// Upload an image
const uploadImage = async (file: File) => {
  try {
    const result = await GoogleDriveService.uploadFile({
      fileName: file.name,
      fileContent: await file.arrayBuffer(),
      mimeType: file.type,
    });
    
    console.log('File uploaded:', result);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### List Files
```typescript
// List files in the main folder
const listFiles = async () => {
  try {
    const files = await GoogleDriveService.listFiles();
    console.log('Files:', files);
    return files;
  } catch (error) {
    console.error('Failed to list files:', error);
  }
};
```

### Download a File
```typescript
// Download a file by ID
const downloadFile = async (fileId: string) => {
  try {
    const fileBuffer = await GoogleDriveService.downloadFile(fileId);
    // Create download link
    const blob = new Blob([fileBuffer]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-file';
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
```

## 🔒 Step 8: Security Best Practices

1. **Never commit service account keys to version control**
2. **Use environment variables for sensitive data**
3. **Implement proper error handling**
4. **Add rate limiting for API calls**
5. **Monitor API usage and costs**

## 📱 Step 9: Integration with FoodVrse

### Use Cases:
- **Profile Pictures**: Store user profile images
- **Document Uploads**: Business documents, certificates
- **Image Storage**: Restaurant photos, food images
- **File Sharing**: Share documents between users
- **Backup**: Store important application data

## 🧪 Step 10: Testing

1. **Test file upload with small images**
2. **Verify file permissions and sharing**
3. **Test file download functionality**
4. **Check error handling for invalid files**
5. **Test with different file types**

## 🚨 Troubleshooting

### Common Issues:
- **Authentication Error**: Check service account key and permissions
- **API Not Enabled**: Ensure Google Drive API is enabled
- **Permission Denied**: Verify folder sharing settings
- **File Size Limit**: Check file size restrictions
- **Rate Limiting**: Implement proper error handling and retries

## 📞 Support

If you encounter issues:
1. Check Google Cloud Console logs
2. Verify API quotas and limits
3. Review service account permissions
4. Check network connectivity
5. Review error messages in console

## 🎯 Next Steps

1. **Complete the setup steps above**
2. **Test with a simple file upload**
3. **Integrate with your FoodVrse components**
4. **Implement proper error handling**
5. **Add file management UI components**

Your Google Drive API is now ready for FoodVrse! 🚀
