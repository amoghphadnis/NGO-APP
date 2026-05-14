import { FormDataUnion } from '@/types/forms';

export const validateFullForm = (formData: FormDataUnion) => {
  const errors: string[] = [];

  if (!formData.personal?.name) {
    errors.push('Personal details incomplete.');
  }

  if (!formData.contact?.email) {
    errors.push('Contact details incomplete.');
  }

  if (!formData.documents?.marksCard) {
    errors.push('Marks card upload required.');
  }

  if (!formData.documents?.aadhaar) {
    errors.push('Aadhaar / ID proof upload required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
