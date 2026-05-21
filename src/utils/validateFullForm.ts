import { FormDataUnion, isProfessionalForm, isPUCForm } from '@/types/forms';

export const validateFullForm = (formData: FormDataUnion) => {
  const errors: string[] = [];

  if (!formData.personal?.name) {
    errors.push('Personal details incomplete.');
  }

  if (!formData.contact?.email) {
    errors.push('Contact details incomplete.');
  }

  if (isProfessionalForm(formData)) {
    if (!formData.documents?.marksCard) {
      errors.push('Marks card upload required.');
    }
    if (!formData.documents?.aadhaar) {
      errors.push('Aadhaar / ID proof upload required.');
    }
  }

  if (isPUCForm(formData)) {
    if (!formData.documents?.sslcMarksCard) {
      errors.push('SSLC marks card upload required.');
    }
    if (!formData.documents?.studentPhoto) {
      errors.push('Student photo upload required.');
    }
    if (!formData.documents?.electricityBill) {
      errors.push('Electricity bill upload required.');
    }
    if (!formData.documents?.rationCard) {
      errors.push('Ration card upload required.');
    }
    if (!formData.documents?.incomeCert) {
      errors.push('Income certificate upload required.');
    }
    if (!formData.documents?.familyPhoto) {
      errors.push('Family photo upload required.');
    }
    if (!formData.documents?.houseVideo) {
      errors.push('House video upload required.');
    }
    if (!formData.documents?.houseVisitLink) {
      errors.push('House visit Google link required.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
