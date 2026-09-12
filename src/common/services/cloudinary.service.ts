import { httpClient } from '@/core/api/axios.adapter';
import axios from 'axios';

interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    const { timestamp, signature, apiKey, cloudName } = 
      await httpClient.get<CloudinarySignature>('/upload/signature');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    throw new Error('Error al autorizar o subir la imagen de perfil');
  }
};
