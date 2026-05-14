import api  from './client';
import { StandardApiResponse, StudentSubmissionPayload } from '@/types/api';

export const studentApi = {
  submitProfessionalStudent: async (formData: FormData): Promise<StandardApiResponse<any>> => {
    try {
      const response = await api.post('/students/professional', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Student submission failed:', error);
      throw error;
    }
  },
};
