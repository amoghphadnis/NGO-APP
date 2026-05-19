import { FormType } from '@/forms/shared/types';
import { createProfessionalStudent } from '@/api/professionalApi';
import { createPUCStudent } from '@/api/pucApi';
import { SubmissionPayload } from './preparePayload';
import { NormalizedApiResponse } from '@/api/transformers/normalizeApiResponse';

export async function submitApplication(
  formType: FormType,
  payload: SubmissionPayload
): Promise<NormalizedApiResponse<any>> {
  if (formType === 'professional') {
    return await createProfessionalStudent(payload);
  }

  return await createPUCStudent(payload);
}
