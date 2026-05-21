import { FormType } from '@/forms/shared/types';
import { ProfessionalFormValues, PucFormValues } from '@/types/forms';
import { professionalMapper } from '@/forms/professional/mapper';
import { pucMapper } from '@/forms/puc/mapper';

export type SubmissionPayload = FormData;

export function preparePayload(
  formType: FormType,
  formData: ProfessionalFormValues | PucFormValues
): SubmissionPayload {
  if (formType === 'professional') {
    return professionalMapper(formData as ProfessionalFormValues);
  }

  return pucMapper(formData as PucFormValues);
}
