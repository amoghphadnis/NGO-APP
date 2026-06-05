import { FormType } from '@/forms/shared/types';
import { ProfessionalFormValues, PucFormValues, PayanaFormValues, SemiProfessionalFormValues } from '@/types/forms';
import { professionalMapper } from '@/forms/professional/mapper';
import { pucMapper } from '@/forms/puc/mapper';
import { mapPayanaFormToApiPayload } from '@/forms/payana/mapper';
import { semiProfessionalMapper } from '@/forms/semiProfessional/mapper';

export type SubmissionPayload = FormData;

export function preparePayload(
  formType: FormType,
  formData: ProfessionalFormValues | PucFormValues | PayanaFormValues | SemiProfessionalFormValues
): SubmissionPayload {
  if (formType === 'professional') {
    return professionalMapper(formData as ProfessionalFormValues);
  }

  if (formType === 'payana') {
    const payanaPayload = mapPayanaFormToApiPayload(formData as PayanaFormValues);
    // Convert Payana object payload to FormData for multipart submission
    const fd = new FormData();
    Object.entries(payanaPayload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });
    return fd;
  }

  if (formType === 'semiProfessional') {
    return semiProfessionalMapper(formData as SemiProfessionalFormValues);
  }

  return pucMapper(formData as PucFormValues);
}
