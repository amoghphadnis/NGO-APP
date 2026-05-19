import { FormType } from '@/forms/shared/types';
import { ProfessionalFormData, PUCFormData } from '@/types/forms';
import { professionalMapper } from '@/forms/professional/mapper';
import { pucMapper } from '@/forms/puc/mapper';

export type SubmissionPayload = FormData;

export function preparePayload(
  formType: FormType,
  formData: ProfessionalFormData | PUCFormData
): SubmissionPayload {
  if (formType === 'professional') {
    return professionalMapper(formData as ProfessionalFormData);
  }

  return pucMapper(formData as PUCFormData);
}
