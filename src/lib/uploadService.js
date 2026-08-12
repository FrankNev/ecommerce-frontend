import { ecommerceAPI } from './axios';

export const uploadImageDirectly = async (file, folderName) => {
  try {
    const sigRes = await ecommerceAPI.get(`/api/upload/signature?folder=${folderName}`);
    
    const { timestamp, signature, cloudName, apiKey, folder, transformation } = sigRes.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);
    formData.append('transformation', transformation);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (uploadData.error) throw new Error(uploadData.error.message);

    return {
      url: uploadData.secure_url,
      public_id: uploadData.public_id
    };
  } catch (error) {
    console.error('Error uploading directly to Cloudinary:', error);
    throw error;
  }
};